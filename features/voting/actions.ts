"use server";

// TODO: Implement voting server actions

export async function requestBlindSignature(blindedToken: string) {
  // TODO: Verify voter eligibility, sign blinded token, log blind sig
}

// Client-side helpers (not server actions — exported for client use)
// encryptVote, generateProofs will live in lib/crypto
