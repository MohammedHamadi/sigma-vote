/**
 * Cryptographically secure BigInt utilities for Voting
 */

/**
 * Modular exponentiation: calculates (base^exp) % mod
 */
export function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  if (mod === 1n) return 0n;
  let result = 1n;
  base = base % mod;
  if (base < 0n) base += mod;
  
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      result = (result * base) % mod;
    }
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  return result;
}

/**
 * Modular multiplicative inverse: find x such that (a * x) % mod == 1
 * Uses Extended Euclidean Algorithm safely.
 * Throws an error if inverse doesn't exist (i.e. gcd(a, mod) != 1).
 */
export function modInverse(a: bigint, mod: bigint): bigint {
  let [old_r, r] = [a % mod, mod];
  let [old_s, s] = [1n, 0n];

  if (old_r < 0n) old_r += mod;

  while (r !== 0n) {
    const quotient = old_r / r;
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
  }

  if (old_r > 1n) {
    throw new Error(`Inverse does not exist for a=${a}, mod=${mod}`);
  }
  
  if (old_s < 0n) old_s += mod;
  return old_s;
}

/**
 * Calculates the Greatest Common Divisor (GCD)
 */
export function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/**
 * Calculates Least Common Multiple (LCM)
 */
export function lcm(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  return (a * b) / gcd(a, b);
}

/**
 * Generates a cryptographically secure random BigInt with up to `bits` bit length
 */
export function randomBigInt(bits: number): bigint {
  if (bits <= 0) return 0n;
  const bytes = Math.ceil(bits / 8);
  const buf = new Uint8Array(bytes);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(buf);
  } else {
    const crypto = require('crypto');
    crypto.randomFillSync(buf);
  }
  let hex = Array.from(buf, x => x.toString(16).padStart(2, '0')).join('');
  let rnd = BigInt('0x' + hex);
  const mask = (1n << BigInt(bits)) - 1n;
  return rnd & mask;
}

/**
 * Miller-Rabin primality test. Tests if a number is prime with high probability.
 */
export function isPrime(n: bigint, k: number = 40): boolean {
  if (n <= 1n) return false;
  if (n <= 3n) return true;
  if (n % 2n === 0n) return false;

  let d = n - 1n;
  let r = 0n;
  while (d % 2n === 0n) {
    d /= 2n;
    r += 1n;
  }

  const bitLength = n.toString(2).length;

  for (let i = 0; i < k; i++) {
    let a: bigint;
    do {
      a = randomBigInt(bitLength);
    } while (a < 2n || a >= n - 2n);

    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;

    let testPass = false;
    for (let j = 0n; j < r - 1n; j++) {
      x = modPow(x, 2n, n);
      if (x === n - 1n) {
        testPass = true;
        break;
      }
    }

    if (!testPass) return false;
  }

  return true;
}

/**
 * Generates a cryptographically secure random prime number of exactly `bits` length.
 */
export function randomPrime(bits: number): bigint {
  while (true) {
    let p = randomBigInt(bits);
    // Ensure it is odd and exactly 'bits' long by setting MSB and LSB
    p |= (1n << BigInt(bits - 1)) | 1n;
    if (isPrime(p)) return p;
  }
}

/**
 * Generates a random BigInt in the range [min, max) securely.
 */
export function randomBigIntInRange(min: bigint, max: bigint): bigint {
  if (max <= min) return min;
  const range = max - min;
  const bitLen = range.toString(2).length;
  let rnd: bigint;
  do {
    rnd = randomBigInt(bitLen);
  } while (rnd >= range);
  return rnd + min;
}
