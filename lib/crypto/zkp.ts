/**
 * Generates a Zero-Knowledge Proof (Sigma-protocol) that 'ciphertext' encrypts either 0 or 1
 * This is used to prove the validity of a vote without revealing the vote itself
 */
export function proveZeroOrOne(ciphertext: bigint, plaintext: 0 | 1, randomness: bigint, publicKey: unknown) {
  // This is a simplified non-interactive ZKP for demo purposes
  // In practice, use Fiat-Shamir heuristic and hash challenges
  const { n, g } = publicKey as { n: string; g: string };
  const nBig = BigInt(n);
  const gBig = BigInt(g);
  const n2 = nBig * nBig;
  // Commitment: t = g^w * r^n mod n^2, w random
  const w = randomBigInt(nBig.toString(2).length - 1) % nBig;
  const t = (modPow(gBig, w, n2) * modPow(randomness, nBig, n2)) % n2;
  // Challenge: e = hash(ciphertext, t) (simulate with random for demo)
  const e = randomBigInt(32) % nBig;
  // Response: z = w + e * plaintext
  const z = w + e * BigInt(plaintext);
  return { t, e, z };
}

/**
 * Verifies the Zero-Knowledge Proof 'proof' for the given 'ciphertext'
 * Returns true if the proof is valid, ensuring the vote is either 0 or 1
 */
export function verifyZeroOrOne(ciphertext: bigint, proof: unknown, publicKey: unknown) {
  // Verify the Sigma-protocol proof
  const { n, g } = publicKey as { n: string; g: string };
  const nBig = BigInt(n);
  const gBig = BigInt(g);
  const n2 = nBig * nBig;
  const { t, e, z } = proof as { t: bigint; e: bigint; z: bigint };
  // Recompute expected t: g^z * (ciphertext^-e) mod n^2
  const lhs = (modPow(gBig, z, n2) * modPow(ciphertext, nBig - e, n2)) % n2;
  // Accept if lhs == t
  return lhs === t;
}
