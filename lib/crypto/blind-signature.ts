// TODO: RSA blind signature implementation

export function blindMessage(message: bigint, r: bigint, publicKey: unknown) {
  // TODO: Blind a message
}

export function signBlinded(blindedMessage: bigint, privateKey: unknown) {
  // TODO: Sign a blinded message
}

export function unblindSignature(blindedSig: bigint, r: bigint, publicKey: unknown) {
  // TODO: Unblind the signature
}

export function verifySignature(message: bigint, signature: bigint, publicKey: unknown) {
  // TODO: Verify an unblinded signature
}
