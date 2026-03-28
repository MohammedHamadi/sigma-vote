import { randomBigIntInRange, modInverse } from './bigint-utils';

// Standard 256-bit prime for the finite field: 2^256 - 189
const PRIME = 2n ** 256n - 189n;

/**
 * Splits a secret into 'n' shares with a threshold 'k'
 * Uses a polynomial f(x) of degree (k-1) where f(0) = secret over Z_p
 */
export function splitSecret(secret: bigint, n: number, k: number) {
  if (secret >= PRIME || secret < 0n) {
    throw new Error('Secret must be in range [0, PRIME)');
  }

  // Generate random coefficients for the polynomial in Z_p
  const coeffs = [secret];
  for (let i = 1; i < k; i++) {
    coeffs.push(randomBigIntInRange(1n, PRIME));
  }

  // Evaluate polynomial at x = 1..n over Z_p
  const shares: { x: bigint; y: bigint }[] = [];
  for (let i = 1; i <= n; i++) {
    let x = BigInt(i);
    let y = 0n;
    // Evaluate using Horner's method for efficiency and correctness
    for (let j = coeffs.length - 1; j >= 0; j--) {
      y = (y * x + coeffs[j]) % PRIME;
    }
    shares.push({ x, y });
  }
  return shares;
}

/**
 * Reconstructs the secret from 'k' or more shares
 * Uses Lagrange interpolation to find f(0) over Z_p
 */
export function reconstructSecret(shares: unknown[]) {
  const points = shares as { x: bigint; y: bigint }[];
  let secret = 0n;

  for (let i = 0; i < points.length; i++) {
    let xi = points[i].x;
    let yi = points[i].y;

    let num = 1n;
    let den = 1n;

    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        let xj = points[j].x;
        
        // Use xj / (xj - xi) which is equivalent to -xj / (xi - xj)
        let diff = (xj - xi) % PRIME;
        if (diff < 0n) diff += PRIME;
        
        num = (num * xj) % PRIME;
        den = (den * diff) % PRIME;
      }
    }

    let term = (yi * num) % PRIME;
    term = (term * modInverse(den, PRIME)) % PRIME;
    
    secret = (secret + term) % PRIME;
  }

  return secret;
}
