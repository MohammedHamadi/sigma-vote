import { modPow, modInverse, randomBigIntInRange } from './bigint-utils';

function hashToBigInt(str: string, mod: bigint): bigint {
  let hash = 0n;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31n + BigInt(str.charCodeAt(i))) % mod;
  }
  return hash;
}

/**
 * Generates a Zero-Knowledge Proof (Sigma-protocol) that 'ciphertext' encrypts either 0 or 1
 * Uses Cramer-Damgård-Schoenmakers trick for OR proofs over Paillier homomorphic encryption.
 */
export function proveZeroOrOne(ciphertext: bigint, plaintext: 0 | 1, randomness: bigint, publicKey: unknown) {
  const { n, g } = publicKey as { n: string; g: string };
  const nBig = BigInt(n);
  const n2 = nBig * nBig;
  const gBig = BigInt(g);
  
  const m = plaintext;
  const r = randomness;

  const C0 = ciphertext;
  const C1 = (ciphertext * modInverse(gBig, n2)) % n2;
  const bases = [C0, C1];

  let z = [0n, 0n];
  let e = [0n, 0n];

  // 1. Simulate the fake proof
  const fake = 1 - m;
  z[fake] = randomBigIntInRange(1n, nBig);
  e[fake] = randomBigIntInRange(1n, nBig);
  
  const invBaseFake = modInverse(bases[fake], n2);
  let a_fake = (modPow(z[fake], nBig, n2) * modPow(invBaseFake, e[fake], n2)) % n2;

  // 2. Start the real proof
  const w = randomBigIntInRange(1n, nBig);
  let a_real = modPow(w, nBig, n2);

  // Determine a0 and a1 for hashing
  const a0 = m === 0 ? a_real : a_fake;
  const a1 = m === 1 ? a_real : a_fake;

  // 3. Compute Fiat-Shamir challenge
  const challengeStr = `${ciphertext.toString()}-${a0.toString()}-${a1.toString()}`;
  const c = hashToBigInt(challengeStr, nBig);

  // 4. Complete the real proof
  e[m] = (c - e[fake]) % nBig;
  if (e[m] < 0n) e[m] += nBig;

  z[m] = (w * modPow(r, e[m], nBig)) % nBig;

  // Return proof object
  return {
    e0: e[0].toString(),
    e1: e[1].toString(),
    z0: z[0].toString(),
    z1: z[1].toString()
  };
}

/**
 * Verifies the Zero-Knowledge Proof 'proof' for the given 'ciphertext'
 * Returns true if the proof is valid, ensuring the vote is either 0 or 1
 */
export function verifyZeroOrOne(ciphertext: bigint, proof: unknown, publicKey: unknown) {
  const { n, g } = publicKey as { n: string; g: string };
  const nBig = BigInt(n);
  const n2 = nBig * nBig;
  const gBig = BigInt(g);
  
  const { e0, e1, z0, z1 } = proof as { e0: string, e1: string, z0: string, z1: string };
  const e0Big = BigInt(e0);
  const e1Big = BigInt(e1);
  const z0Big = BigInt(z0);
  const z1Big = BigInt(z1);

  const C0 = ciphertext;
  const C1 = (ciphertext * modInverse(gBig, n2)) % n2;

  const invC0 = modInverse(C0, n2);
  const invC1 = modInverse(C1, n2);

  const a0 = (modPow(z0Big, nBig, n2) * modPow(invC0, e0Big, n2)) % n2;
  const a1 = (modPow(z1Big, nBig, n2) * modPow(invC1, e1Big, n2)) % n2;

  const challengeStr = `${ciphertext.toString()}-${a0.toString()}-${a1.toString()}`;
  const c = hashToBigInt(challengeStr, nBig);

  const eSum = (e0Big + e1Big) % nBig;
  
  return c === eSum;
}
