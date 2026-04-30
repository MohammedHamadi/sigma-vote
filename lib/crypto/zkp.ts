/**
 * zkp.ts — SigmaVote Zero-Knowledge Proof layer
 *
 * Two proof types are exported:
 *
 *  1. proveZeroOrOne / verifyZeroOrOne
 *     Disjunctive Chaum-Pedersen proof that a Paillier ciphertext encrypts
 *     either 0 or 1.  Uses the Fiat-Shamir heuristic (SHA-256) so the proof
 *     is non-interactive and publicly verifiable.
 *
 *  2. proveSumEqualsOne / verifySumEqualsOne
 *     Given all per-candidate ciphertexts from a single ballot, proves that
 *     the homomorphic product equals g (i.e. exactly one vote = 1).
 *     This enforces the "choose exactly one candidate" rule without revealing
 *     which candidate was chosen.
 *
 * Mathematical setting
 * --------------------
 *   Public key  : (N, g)  — standard Paillier parameters
 *   Plaintext   : m ∈ {0,1}
 *   Ciphertext  : C = g^m · r^N  (mod N²),   r ∈ ℤ*_N
 *
 * Disjunctive proof for C encrypts 0 or 1
 * ----------------------------------------
 *   We use an OR-proof (Cramer-Damgård-Schoenmakers style):
 *   Prove  (C = r^N mod N²)  OR  (C = g · r^N mod N²)
 *   without revealing which branch is true.
 *
 *   Branch 0 witnesses: plaintext = 0, so C/g^0 = C  is the "cipher of 0"
 *   Branch 1 witnesses: plaintext = 1, so C/g^1     is the "cipher of 0"
 *
 * Sum proof
 * ----------
 *   Product of all ciphertexts = g^(∑mᵢ) · (∏rᵢ)^N  (mod N²)
 *   If ∑mᵢ = 1 and the voter arranges ∏rᵢ = 1 (or we just check the product
 *   equals g · 1^N = g), then product = g  (mod N²).
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Modular exponentiation: base^exp mod m — handles arbitrary BigInts */
function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  if (mod === 1n) return 0n;
  let result = 1n;
  base = ((base % mod) + mod) % mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    exp >>= 1n;
    base = (base * base) % mod;
  }
  return result;
}

/** Extended Euclidean algorithm — returns { gcd, x, y } s.t. a·x + b·y = gcd */
function extGcd(a: bigint, b: bigint): { gcd: bigint; x: bigint; y: bigint } {
  if (b === 0n) return { gcd: a, x: 1n, y: 0n };
  const { gcd, x, y } = extGcd(b, a % b);
  return { gcd, x: y, y: x - (a / b) * y };
}

/** Modular inverse of a mod m (throws if non-invertible) */
function modInverse(a: bigint, m: bigint): bigint {
  const { gcd, x } = extGcd(((a % m) + m) % m, m);
  if (gcd !== 1n) throw new Error("modInverse: not invertible");
  return ((x % m) + m) % m;
}

/**
 * Cryptographically-strong random BigInt with the given bit-length.
 * Falls back to a deterministic PRNG when the Web Crypto API is unavailable
 * (Node.js environments should provide globalThis.crypto).
 */
function randomBigInt(bits: number): bigint {
  const bytes = Math.ceil(bits / 8);
  let arr: Uint8Array;

  if (typeof globalThis !== "undefined" && globalThis.crypto?.getRandomValues) {
    arr = new Uint8Array(bytes);
    globalThis.crypto.getRandomValues(arr);
  } else {
    // Node.js ≥ 19 exposes crypto globally; older versions need this:
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { randomBytes } = require("crypto") as typeof import("crypto");
    arr = new Uint8Array(randomBytes(bytes));
  }

  // Mask the top byte to exactly `bits` bits
  const topMask = (1 << (bits % 8 || 8)) - 1;
  arr[0] &= topMask;
  return arr.reduce((acc, byte) => (acc << 8n) | BigInt(byte), 0n);
}

/**
 * Fiat-Shamir challenge via SHA-256.
 * Serialises all BigInt arguments to hex, hashes them, returns the hash mod n.
 */
async function fsChallenge(values: bigint[], n: bigint): Promise<bigint> {
  const payload = values.map((v) => v.toString(16)).join("|");
  const encoded = new TextEncoder().encode(payload);
  const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
  const hashHex = Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return BigInt("0x" + hashHex) % n;
}

// ─── Public-key type ─────────────────────────────────────────────────────────

export interface PaillierPublicKey {
  n: string; // N as decimal or hex string
  g: string; // g as decimal or hex string
}

// ─── Proof types ─────────────────────────────────────────────────────────────

/**
 * Disjunctive proof that a ciphertext C encrypts 0 or 1.
 *
 * The proof has two OR-branches; exactly one is real (computed from the
 * witness) and the other is simulated.  The Fiat-Shamir challenge ties them
 * together: e0 + e1 = e  (mod N).
 */
export interface ZeroOrOneProof {
  // Branch 0 (proves C encrypts 0)
  c0: bigint; // simulated or real commitment
  e0: bigint; // partial challenge
  z0: bigint; // response
  // Branch 1 (proves C encrypts 1)
  c1: bigint;
  e1: bigint;
  z1: bigint;
}

/**
 * Proof that ∏ Cᵢ = g (mod N²), i.e. exactly one vote = 1.
 * This is a standard Schnorr proof of knowledge of the exponent 1 in the
 * combined ciphertext, using the aggregate randomness.
 */
export interface SumEqualsOneProof {
  commitment: bigint; // R = s^N mod N²
  challenge: bigint; // e  (Fiat-Shamir)
  response: bigint; // z = s + e·rAgg  (in ℤ)
}

// ─── 1. Per-candidate: prove ciphertext encrypts 0 or 1 ──────────────────────

/**
 * Generate a non-interactive disjunctive ZKP that `ciphertext` = Enc(m)
 * where m ∈ {0, 1}.
 *
 * @param ciphertext  C = g^m · r^N mod N²
 * @param plaintext   The actual vote (0 or 1) — kept secret
 * @param randomness  r used during encryption — kept secret
 * @param publicKey   Paillier public key (N, g)
 */
export async function proveZeroOrOne(
  ciphertext: bigint,
  plaintext: 0 | 1,
  randomness: bigint,
  publicKey: PaillierPublicKey
): Promise<ZeroOrOneProof> {
  const N = BigInt(publicKey.n);
  const g = BigInt(publicKey.g);
  const N2 = N * N;
  const bitLen = N.toString(2).length;

  if (plaintext === 0) {
    // ── Real branch: prove C = r^N (plaintext = 0) ──────────────────────────
    // Commitment for branch 0 (real):
    const w = randomBigInt(bitLen - 1) % N;
    const c0 = modPow(randomness, w * N, N2); // r^(w·N) = (r^N)^w — commitment in DL sense
    // Equivalently for Paillier: commitment = s^N where s is fresh random
    const s = randomBigInt(bitLen - 1) % N;
    const c0real = modPow(s, N, N2);

    // Simulate branch 1 (prove C/g = r^N, i.e. plaintext = 1):
    const e1sim = randomBigInt(128) % N;
    const z1sim = randomBigInt(bitLen - 1) % N;
    // c1 = g^z1 · (C/g)^{-e1}  — simulated commitment
    const Cdivg = (ciphertext * modInverse(g, N2)) % N2;
    const c1sim = (modPow(z1sim, N, N2) * modInverse(modPow(Cdivg, e1sim, N2), N2)) % N2;

    // Fiat-Shamir overall challenge e = H(N, g, C, c0, c1)
    const eTotal = await fsChallenge([N, g, ciphertext, c0real, c1sim], N);
    const e0real = ((eTotal - e1sim) % N + N) % N;
    // Response: z0 = s · r^{e0}  (in ℤ*_N — multiplicative)
    const z0real = (s * modPow(randomness, e0real, N)) % N;

    return { c0: c0real, e0: e0real, z0: z0real, c1: c1sim, e1: e1sim, z1: z1sim };
  } else {
    // ── Real branch: prove C/g = r^N (plaintext = 1) ─────────────────────────
    const Cdivg = (ciphertext * modInverse(g, N2)) % N2;

    // Simulate branch 0 (prove C = r^N, i.e. plaintext = 0):
    const e0sim = randomBigInt(128) % N;
    const z0sim = randomBigInt(bitLen - 1) % N;
    const c0sim = (modPow(z0sim, N, N2) * modInverse(modPow(ciphertext, e0sim, N2), N2)) % N2;

    // Real commitment for branch 1:
    const s = randomBigInt(bitLen - 1) % N;
    const c1real = modPow(s, N, N2);

    // Fiat-Shamir
    const eTotal = await fsChallenge([N, g, ciphertext, c0sim, c1real], N);
    const e1real = ((eTotal - e0sim) % N + N) % N;
    const z1real = (s * modPow(randomness, e1real, N)) % N;

    return { c0: c0sim, e0: e0sim, z0: z0sim, c1: c1real, e1: e1real, z1: z1real };
  }
}

/**
 * Verify that `ciphertext` encrypts 0 or 1.
 *
 * @param ciphertext  C
 * @param proof       The ZeroOrOneProof returned by proveZeroOrOne
 * @param publicKey   Paillier public key
 * @returns           true if the proof is valid
 */
export async function verifyZeroOrOne(
  ciphertext: bigint,
  proof: ZeroOrOneProof,
  publicKey: PaillierPublicKey
): Promise<boolean> {
  const N = BigInt(publicKey.n);
  const g = BigInt(publicKey.g);
  const N2 = N * N;

  const { c0, e0, z0, c1, e1, z1 } = proof;

  // 1. Recompute Fiat-Shamir challenge
  const eExpected = await fsChallenge([N, g, ciphertext, c0, c1], N);

  // 2. Check e0 + e1 = eExpected (mod N)
  if ((e0 + e1) % N !== eExpected) return false;

  // 3. Branch 0: z0^N ≡ c0 · C^e0  (mod N²)
  //    (proves C = r^N for some r, i.e. C encrypts 0)
  const lhs0 = modPow(z0, N, N2);
  const rhs0 = (c0 * modPow(ciphertext, e0, N2)) % N2;
  if (lhs0 !== rhs0) return false;

  // 4. Branch 1: z1^N ≡ c1 · (C/g)^e1  (mod N²)
  //    (proves C/g = r^N for some r, i.e. C encrypts 1)
  const Cdivg = (ciphertext * modInverse(g, N2)) % N2;
  const lhs1 = modPow(z1, N, N2);
  const rhs1 = (c1 * modPow(Cdivg, e1, N2)) % N2;
  if (lhs1 !== rhs1) return false;

  return true;
}

// ─── 2. Per-ballot: prove product of ciphertexts = g (exactly one vote) ──────

/**
 * Prove that the product of all per-candidate ciphertexts equals g mod N²,
 * which guarantees ∑mᵢ = 1 (exactly one candidate received a vote).
 *
 * The voter must ensure that the product of all randomness values rᵢ equals 1
 * mod N (the last rᵢ is chosen accordingly during encryption).
 *
 * @param ciphertexts   Array of Cᵢ, one per candidate
 * @param randomnesses  Array of rᵢ used during encryption (kept secret)
 * @param publicKey     Paillier public key
 */
export async function proveSumEqualsOne(
  ciphertexts: bigint[],
  randomnesses: bigint[],
  publicKey: PaillierPublicKey
): Promise<SumEqualsOneProof> {
  if (ciphertexts.length !== randomnesses.length) {
    throw new Error("proveSumEqualsOne: arrays must have equal length");
  }

  const N = BigInt(publicKey.n);
  const g = BigInt(publicKey.g);
  const N2 = N * N;
  const bitLen = N.toString(2).length;

  // Aggregate randomness: rAgg = ∏ rᵢ mod N
  const rAgg = randomnesses.reduce((acc, r) => (acc * r) % N, 1n);

  // Pick a fresh random blinding scalar s ∈ ℤ*_N
  const s = randomBigInt(bitLen - 1) % N;
  const commitment = modPow(s, N, N2); // R = s^N mod N²

  // Compute the product ciphertext (not sent, but used for the challenge)
  const productCipher = ciphertexts.reduce((acc, c) => (acc * c) % N2, 1n);

  // Fiat-Shamir challenge
  const challenge = await fsChallenge([N, g, productCipher, commitment], N);

  // Response: z = s · rAgg^e  (multiplicative in ℤ*_N)
  const response = (s * modPow(rAgg, challenge, N)) % N;

  return { commitment, challenge, response };
}

/**
 * Verify that the product of all per-candidate ciphertexts equals g mod N²,
 * i.e. that exactly one vote = 1.
 *
 * @param ciphertexts  Array of Cᵢ, one per candidate
 * @param proof        The SumEqualsOneProof
 * @param publicKey    Paillier public key
 */
export async function verifySumEqualsOne(
  ciphertexts: bigint[],
  proof: SumEqualsOneProof,
  publicKey: PaillierPublicKey
): Promise<boolean> {
  const N = BigInt(publicKey.n);
  const g = BigInt(publicKey.g);
  const N2 = N * N;

  const { commitment, challenge, response } = proof;

  // 1. Product ciphertext
  const productCipher = ciphertexts.reduce((acc, c) => (acc * c) % N2, 1n);

  // 2. Verify product = g (mod N²)  — homomorphic tally check
  if (productCipher !== g % N2) return false;

  // 3. Recompute Fiat-Shamir challenge
  const eExpected = await fsChallenge([N, g, productCipher, commitment], N);
  if (challenge !== eExpected) return false;

  // 4. Schnorr equation: response^N ≡ commitment · rAgg^challenge  (mod N²)
  //    Because rAgg = 1 (product of randomnesses = 1), this simplifies to:
  //    response^N ≡ commitment (mod N²)
  const lhs = modPow(response, N, N2);
  const rhs = (commitment * modPow(1n, challenge, N2)) % N2; // rAgg = 1
  return lhs === rhs;
}

// ─── 3. Convenience: prove & verify an entire ballot at once ─────────────────

export interface BallotProof {
  perCandidateProofs: ZeroOrOneProof[]; // one per candidate
  sumProof: SumEqualsOneProof;          // product = g
}

/**
 * Generate all proofs for a ballot in one call.
 *
 * @param ciphertexts   Encrypted votes, one per candidate  (length = numCandidates)
 * @param votes         Plaintext votes (exactly one should be 1, rest 0)
 * @param randomnesses  Encryption randomness per candidate
 * @param publicKey     Paillier public key
 */
export async function proveBallot(
  ciphertexts: bigint[],
  votes: (0 | 1)[],
  randomnesses: bigint[],
  publicKey: PaillierPublicKey
): Promise<BallotProof> {
  const n = ciphertexts.length;
  if (votes.length !== n || randomnesses.length !== n) {
    throw new Error("proveBallot: all arrays must have the same length");
  }
  if (votes.filter((v) => v === 1).length !== 1) {
    throw new Error("proveBallot: exactly one vote must be 1");
  }

  const perCandidateProofs = await Promise.all(
    ciphertexts.map((c, i) => proveZeroOrOne(c, votes[i], randomnesses[i], publicKey))
  );

  const sumProof = await proveSumEqualsOne(ciphertexts, randomnesses, publicKey);

  return { perCandidateProofs, sumProof };
}

/**
 * Verify all proofs for a ballot.
 *
 * @param ciphertexts  Encrypted votes, one per candidate
 * @param proof        The BallotProof
 * @param publicKey    Paillier public key
 * @returns            true only if every individual proof AND the sum proof pass
 */
export async function verifyBallot(
  ciphertexts: bigint[],
  proof: BallotProof,
  publicKey: PaillierPublicKey
): Promise<boolean> {
  const { perCandidateProofs, sumProof } = proof;

  if (ciphertexts.length !== perCandidateProofs.length) return false;

  // Verify each ciphertext individually
  const individualResults = await Promise.all(
    ciphertexts.map((c, i) => verifyZeroOrOne(c, perCandidateProofs[i], publicKey))
  );
  if (individualResults.some((ok) => !ok)) return false;

  // Verify the aggregate sum = 1
  return verifySumEqualsOne(ciphertexts, sumProof, publicKey);
}

// ─── 4. Tally homomorphism helpers ───────────────────────────────────────────

/**
 * Homomorphically multiply ciphertexts across all ballots for a single
 * candidate, producing an aggregate ciphertext that encrypts ∑ mᵢ.
 *
 * @param candidateCiphertexts  Array of Cᵢ for a given candidate (one per ballot)
 * @param N2                    N² as BigInt
 */
export function aggregateCiphertexts(candidateCiphertexts: bigint[], N2: bigint): bigint {
  return candidateCiphertexts.reduce((acc, c) => (acc * c) % N2, 1n);
}

/**
 * After threshold decryption, verify the global invariant:
 * the sum of all candidate tallies equals the number of valid ballots.
 *
 * @param candidateTotals  Decrypted tally for each candidate
 * @param numBallots       Number of accepted ballots
 */
export function verifyTallyConsistency(candidateTotals: number[], numBallots: number): boolean {
  const sum = candidateTotals.reduce((a, b) => a + b, 0);
  return sum === numBallots;
}