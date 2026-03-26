/**
 * Blinds a message using a random factor 'r' and the public key
 * Formula: m' = (m * r^e) mod n
 */
export function blindMessage(message: bigint, r: bigint, publicKey: unknown) {
  // publicKey: { n, e }
  const { n, e } = publicKey as { n: string; e: string };
  const nBig = BigInt(n);
  const eBig = BigInt(e);
  // m' = (m * r^e) mod n
  return (message * modPow(r, eBig, nBig)) % nBig;
}

/**
 * Signs a blinded message using the private key
 * Formula: s' = (m')^d mod n
 */
export function signBlinded(blindedMessage: bigint, privateKey: unknown) {
  // privateKey: { d, n }
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
  // publicKey: { n }
  const { n } = publicKey as { n: string };
  const nBig = BigInt(n);
  // s = (s' * r^-1) mod n
  return (blindedSig * modInverse(r, nBig)) % nBig;
}

/**
 * Verifies that the unblinded signature matches the original message
 * Formula: s^e mod n == m
 */
export function verifySignature(message: bigint, signature: bigint, publicKey: unknown) {
  // publicKey: { n, e }
  const { n, e } = publicKey as { n: string; e: string };
  const nBig = BigInt(n);
  const eBig = BigInt(e);
  // s^e mod n == m
  return modPow(signature, eBig, nBig) === message;
}
