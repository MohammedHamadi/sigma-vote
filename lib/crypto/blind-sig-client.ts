import { randomBigIntInRange, gcd } from './bigint-utils';
import { blindMessage, unblindSignature, verifySignature } from './blind-signature';

/**
 * Client-safe helper for generating a random ballot token
 * Token must be in the range [2, n)
 */
export function generateBallotToken(rsaPubN: string): bigint {
  const nBig = BigInt(rsaPubN);
  return randomBigIntInRange(2n, nBig);
}

/**
 * Generates a random token, a blinding factor, and blinds the token.
 */
export function generateAndBlindToken(rsaPubKey: { n: string; e: string }) {
  const nBig = BigInt(rsaPubKey.n);
  const token = randomBigIntInRange(2n, nBig);
  
  let blindingFactor: bigint;
  do {
    blindingFactor = randomBigIntInRange(2n, nBig);
  } while (gcd(blindingFactor, nBig) !== 1n);

  const blindedToken = blindMessage(token, blindingFactor, rsaPubKey);
  
  return {
    token,
    blindingFactor,
    blindedToken,
  };
}

/**
 * Unblinds the signature, verifies it locally, and returns a Base64 encoded credential blob.
 */
export function unblindAndPackCredential(
  blindedSigHex: string,
  blindingFactor: bigint,
  token: bigint,
  rsaPubKey: { n: string; e: string }
) {
  const blindedSig = BigInt(blindedSigHex);
  const unblindedSig = unblindSignature(blindedSig, blindingFactor, rsaPubKey);

  // Local verification to ensure everything is correct
  const isValid = verifySignature(token, unblindedSig, rsaPubKey);
  if (!isValid) {
    throw new Error('Local verification of blind signature failed. The server signature may be invalid.');
  }

  // Pack as JSON and Base64 encode for easy copying
  const credentialObj = {
    token: token.toString(),
    signature: unblindedSig.toString(),
  };

  const credentialBlob = btoa(JSON.stringify(credentialObj));

  return {
    token: credentialObj.token,
    signature: credentialObj.signature,
    credential: credentialBlob,
  };
}
