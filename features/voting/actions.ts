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

  return { signature: signature.toString() };
}
