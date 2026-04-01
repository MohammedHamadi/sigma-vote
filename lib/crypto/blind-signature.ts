import { modPow, modInverse, gcd, lcm, randomPrime, randomBigIntInRange } from './bigint-utils';
import { RSAKeyPair } from '../../types/crypto';

/**
 * Generates an RSA keypair for blind signatures
 * Uses Paillier's n as the modulus (shared with Paillier for simplicity)
 */
export function generateRSAKeyPair(_paillierN: bigint) {
  const e = 65537n;
  // We need phi(n) to compute d. Since n = p*q (from Paillier),
  // we need to regenerate p and q or store phi separately.
  // For this implementation, we'll generate fresh RSA primes.
  const bits = 1024;
  let p: bigint, q: bigint;
  do {
    p = randomPrime(bits);
    q = randomPrime(bits);
  } while (p === q);

  const nRsa = p * q;
  const phi = lcm(p - 1n, q - 1n);
  const d = modInverse(e, phi);

  const keypair: RSAKeyPair = {
    publicKey: { n: nRsa.toString(), e: e.toString() },
    privateKey: { d: d.toString() },
  };
  return keypair;
}

/**
 * Generates a valid blinding factor 'r' for a given RSA public key
 */
export function generateBlindingFactor(publicKey: unknown): bigint {
  const { n } = publicKey as { n: string };
  const nBig = BigInt(n);
  let r: bigint;
  do {
    // r must be strictly between 1 and n, and coprime to n
    r = randomBigIntInRange(2n, nBig);
  } while (gcd(r, nBig) !== 1n);
  return r;
}

/**
 * Blinds a message using a random factor 'r' and the public key
 * Formula: m' = (m * r^e) mod n
 * Note: 'message' MUST be properly hashed and padded (e.g. FDH/PSS) before blinding.
 */
export function blindMessage(message: bigint, r: bigint, publicKey: unknown) {
  const { n, e } = publicKey as { n: string; e: string };
  const nBig = BigInt(n);
  const eBig = BigInt(e);
  
  if (gcd(r, nBig) !== 1n) {
    throw new Error('Blinding factor r must be coprime to n');
  }
  // m' = (m * r^e) mod n
  return (message * modPow(r, eBig, nBig)) % nBig;
}

/**
 * Signs a blinded message using the private key
 * Formula: s' = (m')^d mod n
 */
export function signBlinded(blindedMessage: bigint, privateKey: unknown) {
  const { d, n } = privateKey as { d: string; n: string };
  const dBig = BigInt(d);
  const nBig = BigInt(n);
  // s' = (m')^d mod n
  return modPow(blindedMessage, dBig, nBig);
}

/**
 * Removes the blinding factor from the signature
 * Formula: s = (s' * r^-1) mod n
 */
export function unblindSignature(blindedSig: bigint, r: bigint, publicKey: unknown) {
  const { n } = publicKey as { n: string };
  const nBig = BigInt(n);
  
  if (gcd(r, nBig) !== 1n) {
    throw new Error('Blinding factor r must be coprime to n');
  }
  // s = (s' * r^-1) mod n
  return (blindedSig * modInverse(r, nBig)) % nBig;
}

/**
 * Verifies that the unblinded signature matches the original message
 * Formula: s^e mod n == m
 */
export function verifySignature(message: bigint, signature: bigint, publicKey: unknown) {
  const { n, e } = publicKey as { n: string; e: string };
  const nBig = BigInt(n);
  const eBig = BigInt(e);
  // s^e mod n == m
  return modPow(signature, eBig, nBig) === message;
}
