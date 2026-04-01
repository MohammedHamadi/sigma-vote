import { randomBigIntInRange, modInverse } from './bigint-utils';

// Standard 256-bit prime for the finite field: 2^256 - 189
const PRIME = 2n ** 256n - 189n;
const CHUNK_BITS = 256;

function toChunks(secret: bigint): bigint[] {
  const chunks: bigint[] = [];
  let remaining = secret;
  while (remaining > 0n) {
    chunks.push(remaining % PRIME);
    remaining /= PRIME;
  }
  return chunks;
}

function fromChunks(chunks: bigint[]): bigint {
  let result = 0n;
  let multiplier = 1n;
  for (const chunk of chunks) {
    result += chunk * multiplier;
    multiplier *= PRIME;
  }
  return result;
}

function splitChunk(chunk: bigint, n: number, k: number): { x: bigint; y: bigint }[] {
  const coeffs = [chunk];
  for (let i = 1; i < k; i++) {
    coeffs.push(randomBigIntInRange(1n, PRIME));
  }

  const shares: { x: bigint; y: bigint }[] = [];
  for (let i = 1; i <= n; i++) {
    const x = BigInt(i);
    let y = 0n;
    for (let j = coeffs.length - 1; j >= 0; j--) {
      y = (y * x + coeffs[j]) % PRIME;
    }
    shares.push({ x, y });
  }
  return shares;
}

function reconstructChunk(shares: { x: bigint; y: bigint }[]): bigint {
  let secret = 0n;

  for (let i = 0; i < shares.length; i++) {
    const xi = shares[i].x;
    const yi = shares[i].y;

    let num = 1n;
    let den = 1n;

    for (let j = 0; j < shares.length; j++) {
      if (i !== j) {
        const xj = shares[j].x;
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

/**
 * Splits a secret into 'n' shares with a threshold 'k'
 * Chunks the secret into 256-bit pieces and shares each independently.
 */
export function splitSecret(secret: bigint, n: number, k: number) {
  if (secret < 0n) {
    throw new Error('Secret must be non-negative');
  }

  const chunks = toChunks(secret);
  const allChunkShares = chunks.map((chunk) => splitChunk(chunk, n, k));

  const shares: { x: bigint; y: bigint }[] = [];
  for (let i = 0; i < n; i++) {
    let combinedY = 0n;
    let multiplier = 1n;
    for (let c = 0; c < allChunkShares.length; c++) {
      combinedY += allChunkShares[c][i].y * multiplier;
      multiplier *= PRIME;
    }
    shares.push({ x: allChunkShares[0][i].x, y: combinedY });
  }
  return shares;
}

/**
 * Reconstructs the secret from 'k' or more shares
 * Reconstructs each 256-bit chunk independently and concatenates.
 */
export function reconstructSecret(shares: unknown[]) {
  const points = shares as { x: bigint; y: bigint }[];
  if (points.length === 0) throw new Error('No shares provided');

  const numChunks = Math.ceil(points[0].y.toString(2).length / CHUNK_BITS) || 1;
  const chunks: bigint[] = [];

  for (let c = 0; c < numChunks; c++) {
    const chunkShares = points.map((p) => ({
      x: p.x,
      y: (p.y / PRIME ** BigInt(c)) % PRIME,
    }));
    chunks.push(reconstructChunk(chunkShares));
  }

  return fromChunks(chunks);
}
