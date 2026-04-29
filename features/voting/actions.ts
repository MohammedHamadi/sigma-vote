"use server";

import { auth } from "@/auth";
import { getElectionById as dbGetElectionById } from "@/db-actions/elections";
import { hasVoterReceivedSig, logBlindSig } from "@/db-actions/blindSigLog";
import { signBlinded } from "@/lib/crypto/blind-signature";

export async function requestBlindSignature(electionId: string, blindedToken: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const id = parseInt(electionId, 10);
  if (isNaN(id)) throw new Error("Invalid election ID");

  const election = await dbGetElectionById(id);
  if (!election) throw new Error("Election not found");
  if (election.status !== "OPEN") {
    throw new Error(`Election is not open (current status: ${election.status})`);
  }

  const voterId = parseInt(session.user.id, 10);
  const alreadySigned = await hasVoterReceivedSig(id, voterId);
  if (alreadySigned) {
    throw new Error("Voter has already received a blind signature for this election");
  }

  if (!election.rsaPrivD) {
    throw new Error("Election RSA private key not available");
  }

  const blindedTokenBigInt = BigInt(blindedToken);
  const rsaPrivateKey = { d: election.rsaPrivD, n: election.rsaPubN };
  const signature = signBlinded(blindedTokenBigInt, rsaPrivateKey);

  await logBlindSig(id, voterId);

  return { 
    signature: signature.toString(),
    rsaPubE: election.rsaPubE,
    rsaPubN: election.rsaPubN,
  };
}

export async function checkBlindSignatureStatus(electionId: string): Promise<{ hasSignature: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { hasSignature: false };
  }

  const id = parseInt(electionId, 10);
  if (isNaN(id)) return { hasSignature: false };

  const voterId = parseInt(session.user.id, 10);
  const hasSignature = await hasVoterReceivedSig(id, voterId);
  
  return { hasSignature };
}

import { isTokenUsedInElection } from "@/db-actions/usedTokens";
import { verifySignature } from "@/lib/crypto/blind-signature";

export async function verifyVotingCredential(electionId: number, token: string, signature: string) {
  const election = await dbGetElectionById(electionId);
  if (!election) throw new Error("Election not found");
  if (election.status !== "OPEN") {
    throw new Error("Election is not open");
  }

  const tokenBigInt = BigInt(token);
  const signatureBigInt = BigInt(signature);
  const rsaPublicKey = { n: election.rsaPubN, e: election.rsaPubE };

  const sigValid = verifySignature(tokenBigInt, signatureBigInt, rsaPublicKey);
  if (!sigValid) {
    throw new Error("Invalid blind signature");
  }

  const alreadyUsed = await isTokenUsedInElection(token, electionId);
  if (alreadyUsed) {
    throw new Error("Token already used");
  }

  return { valid: true };
}
