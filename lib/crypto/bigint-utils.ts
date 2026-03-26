/**
 * Modular exponentiation: calculcates (base^exp) % mod
 * Uses a memory-efficient algorithm like binary exponentiation or windowed method
 */
export function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  // Modular exponentiation using right-to-left binary method
  let result = 1n;
  base = base % mod;
  while (exp > 0) {
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
 * Typically implemented using the Extended Euclidean Algorithm
 */
export function modInverse(a: bigint, mod: bigint): bigint {
  // Extended Euclidean Algorithm
  let m0 = mod, t, q;
  let x0 = 0n, x1 = 1n;
  if (mod === 1n) return 0n;
  while (a > 1n) {
    q = a / mod;
    t = mod;
    mod = a % mod;
    a = t;
    t = x0;
    x0 = x1 - q * x0;
    x1 = t;
  }
  if (x1 < 0n) x1 += m0;
  return x1;
}

/**
 * Calculates the Greatest Common Divisor (GCD) of a and b
 */
export function gcd(a: bigint, b: bigint): bigint {
  // Euclidean algorithm
  while (b !== 0n) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/**
 * Generates a cryptographically secure random BigInt with specified bit length
 */
export function randomBigInt(bits: number): bigint {
  // Generate a cryptographically secure random bigint of given bit length
  if (bits <= 0) return 0n;
  const bytes = Math.ceil(bits / 8);
  const buf = new Uint8Array(bytes);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(buf);
  } else {
    // Node.js
    const crypto = require('crypto');
    crypto.randomFillSync(buf);
  }
  let hex = Array.from(buf, x => x.toString(16).padStart(2, '0')).join('');
  let rnd = BigInt('0x' + hex);
  // Mask to the correct number of bits
  const mask = (1n << BigInt(bits)) - 1n;
  return rnd & mask;
}
