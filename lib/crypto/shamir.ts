/**
 * Splits a secret into 'n' shares with a threshold 'k'
 * Uses a polynomial f(x) of degree (k-1) where f(0) = secret
 * Each share is a point (x, f(x)) for x = 1, ..., n
 */
export function splitSecret(secret: bigint, n: number, k: number) {
  // Generate random coefficients for the polynomial
  const coeffs = [secret];
  for (let i = 1; i < k; i++) {
    coeffs.push(BigInt(Math.floor(Math.random() * 1e12)));
  }
  // Evaluate polynomial at x = 1..n
  const shares: { x: bigint; y: bigint }[] = [];
  for (let i = 1; i <= n; i++) {
    let x = BigInt(i);
    let y = coeffs[0];
    for (let j = 1; j < coeffs.length; j++) {
      y += coeffs[j] * (x ** BigInt(j));
    }
    shares.push({ x, y });
  }
  return shares;
}

/**
 * Reconstructs the secret from 'k' or more shares
 * Uses Lagrange interpolation to find f(0)
 */
export function reconstructSecret(shares: unknown[]) {
  // Lagrange interpolation at x=0
  const points = shares as { x: bigint; y: bigint }[];
  let secret = 0n;
  for (let i = 0; i < points.length; i++) {
    let xi = points[i].x;
    let yi = points[i].y;
    let num = 1n, den = 1n;
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        num *= -points[j].x;
        den *= (xi - points[j].x);
      }
    }
    secret += yi * num * modInverse(den, 2n ** 256n); // Use a large prime for mod
  }
  // Optionally mod by a large prime if needed
  return secret;
}
