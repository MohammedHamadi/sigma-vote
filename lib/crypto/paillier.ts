import { PaillierKeyPair } from '../../types/crypto';
import { modPow, modInverse, gcd, randomBigInt } from './bigint-utils';
/**
 * Generates a Paillier keypair
 * Public key: (n = p*q, g) where g is often n+1
 * Private key: (lambda = lcm(p-1, q-1), mu = L(g^lambda mod n^2)^-1 mod n)
 */
export function generatePaillierKeypair() {
  // Key size in bits (e.g., 2048 for real use, 128 for demo)
  const bits = 128;
  let p: bigint, q: bigint, n: bigint, lambda: bigint;
  // Generate two large primes p and q
  while (true) {
    p = randomBigInt(bits / 2) | 1n;
    q = randomBigInt(bits / 2) | 1n;
    if (p !== q && gcd(p, q) === 1n) break;
  }
  n = p * q;
  const g = n + 1n;
  const n2 = n * n;
  // lambda = lcm(p-1, q-1)
  const lcm = (a: bigint, b: bigint) => (a * b) / gcd(a, b);
  lambda = lcm(p - 1n, q - 1n);
  // mu = (L(g^lambda mod n^2))^-1 mod n
  const L = (x: bigint) => (x - 1n) / n;
  const mu = modInverse(L(modPow(g, lambda, n2)), n);
  const keypair: PaillierKeyPair = {
    publicKey: {
      n: n.toString(),
      g: g.toString(),
    },
    privateKey: {
      lambda: lambda.toString(),
      mu: mu.toString(),
    },
  };
  return keypair;
}

/**
 * Encrypts a plaintext message 'm' using the public key
 * Formula: c = (g^m * r^n) mod n^2, where 'r' is a random number
 */
export function paillierEncrypt(plaintext: bigint, publicKey: unknown) {
  // publicKey: { n, g }
  const { n, g } = publicKey as { n: string; g: string };
  const nBig = BigInt(n);
  const gBig = BigInt(g);
  const n2 = nBig * nBig;
  let r: bigint;
  do {
    r = randomBigInt(nBig.toString(2).length - 1) % nBig;
  } while (gcd(r, nBig) !== 1n || r === 0n);
  // c = (g^m * r^n) mod n^2
  const c = (modPow(gBig, plaintext, n2) * modPow(r, nBig, n2)) % n2;
  return c;
}

/**
 * Decrypts a ciphertext 'c' using the private key
 * Formula: m = (L(c^lambda mod n^2) * mu) mod n
 */
export function paillierDecrypt(ciphertext: bigint, privateKey: unknown) {
  // privateKey: { lambda, mu }, needs n from publicKey
  // For simplicity, require privateKey to also include n
  const { lambda, mu, n } = privateKey as { lambda: string; mu: string; n: string };
  const nBig = BigInt(n);
  const n2 = nBig * nBig;
  const lambdaBig = BigInt(lambda);
  const muBig = BigInt(mu);
  const L = (x: bigint) => (x - 1n) / nBig;
  const u = modPow(ciphertext, lambdaBig, n2);
  const m = (L(u) * muBig) % nBig;
  return m;
}

/**
 * Homomorphically adds two ciphertexts
 * Formula: E(m1 + m2) = (E(m1) * E(m2)) mod n^2
 */
export function homomorphicAdd(c1: bigint, c2: bigint, publicKey: unknown) {
  // publicKey: { RSAn }
  const { n } = publicKey as { n: string };
  const nBig = BigInt(n);
  const n2 = nBig * nBig;
  return (c1 * c2) % n2;
}
