"use server";

import {
  createElection as dbCreateElection,
  getElectionById as dbGetElectionById,
  updateElectionStatus,
  updateElectionResults,
} from "@/db-actions/elections";
import {
  addCandidate as dbAddCandidate,
  getCandidatesByElection,
} from "@/db-actions/candidates";
import {
  storeKeyShare,
  getSubmittedSharesByElection,
  markShareSubmitted,
} from "@/db-actions/keyShares";
import { getBallotsByElection } from "@/db-actions/ballots";
import { generatePaillierKeypair, paillierDecrypt, homomorphicAdd } from "@/lib/crypto/paillier";
import { generateRSAKeyPair } from "@/lib/crypto/blind-signature";
import { splitSecret, reconstructSecret } from "@/lib/crypto/shamir";
import { jsonParse } from "@/lib/db-utils";

export async function createElection(data: {
  title: string;
  description: string;
  threshold: number;
  totalShares: number;
  startTime?: string;
  endTime?: string;
  adminIds: number[];
}) {
  if (data.threshold > data.totalShares) {
    throw new Error("Threshold cannot exceed total shares");
  }
  if (data.adminIds.length !== data.totalShares) {
    throw new Error("Number of admin IDs must match total shares");
  }

  const paillierKeypair = generatePaillierKeypair();
  const rsaKeypair = generateRSAKeyPair(BigInt(paillierKeypair.publicKey.n));

  const election = await dbCreateElection({
    title: data.title,
    description: data.description,
    status: "SETUP",
    paillierPubN: paillierKeypair.publicKey.n,
    paillierPubG: paillierKeypair.publicKey.g,
    rsaPubE: rsaKeypair.publicKey.e,
    rsaPubN: rsaKeypair.publicKey.n,
    rsaPrivD: rsaKeypair.privateKey.d,
    threshold: data.threshold,
    totalShares: data.totalShares,
    startTime: data.startTime ? new Date(data.startTime) : null,
    endTime: data.endTime ? new Date(data.endTime) : null,
  });

  const lambdaSecret = BigInt(paillierKeypair.privateKey.lambda);
  const shares = splitSecret(lambdaSecret, data.totalShares, data.threshold);

  const storedShares = [];
  for (let i = 0; i < data.adminIds.length; i++) {
    const share = await storeKeyShare({
      electionId: election.id,
      adminId: data.adminIds[i],
      shareX: shares[i].x.toString(),
      shareY: shares[i].y.toString(),
    });
    storedShares.push({ ...share, shareValue: shares[i].y.toString() });
  }

  return {
    election,
    shares: storedShares,
  };
}

export async function openElection(electionId: string) {
  const id = parseInt(electionId, 10);
  if (isNaN(id)) throw new Error("Invalid election ID");

  const election = await dbGetElectionById(id);
  if (!election) throw new Error("Election not found");
  if (election.status !== "SETUP") {
    throw new Error(`Cannot open election in ${election.status} status`);
  }

  const candidates = await getCandidatesByElection(id);
  if (candidates.length === 0) {
    throw new Error("Cannot open election without candidates");
  }

  return updateElectionStatus(id, "OPEN");
}

export async function closeElection(electionId: string) {
  const id = parseInt(electionId, 10);
  if (isNaN(id)) throw new Error("Invalid election ID");

  const election = await dbGetElectionById(id);
  if (!election) throw new Error("Election not found");
  if (election.status !== "OPEN") {
    throw new Error(`Cannot close election in ${election.status} status`);
  }

  return updateElectionStatus(id, "CLOSED");
}

export async function addCandidate(electionId: string, data: { name: string; party?: string; position: number }) {
  const id = parseInt(electionId, 10);
  if (isNaN(id)) throw new Error("Invalid election ID");

  const election = await dbGetElectionById(id);
  if (!election) throw new Error("Election not found");
  if (election.status !== "SETUP") {
    throw new Error("Can only add candidates during SETUP");
  }

  return dbAddCandidate({ electionId: id, name: data.name, party: data.party ?? null, position: data.position });
}

export async function submitKeyShare(electionId: string, adminId: string) {
  const eId = parseInt(electionId, 10);
  const aId = parseInt(adminId, 10);
  if (isNaN(eId) || isNaN(aId)) throw new Error("Invalid IDs");

  const election = await dbGetElectionById(eId);
  if (!election) throw new Error("Election not found");

  const submitted = await getSubmittedSharesByElection(eId);
  const alreadySubmitted = submitted.some((s) => s.adminId === aId);
  if (alreadySubmitted) {
    throw new Error("Admin has already submitted their key share");
  }

  const updated = await markShareSubmitted(submitted.length + 1);

  const newCount = submitted.length + 1;
  const thresholdMet = newCount >= election.threshold;

  return { share: updated, thresholdMet, submittedCount: newCount, threshold: election.threshold };
}

export async function tally(electionId: string) {
  const id = parseInt(electionId, 10);
  if (isNaN(id)) throw new Error("Invalid election ID");

  const election = await dbGetElectionById(id);
  if (!election) throw new Error("Election not found");
  if (election.status !== "CLOSED") {
    throw new Error(`Can only tally CLOSED elections (current: ${election.status})`);
  }

  const submittedShares = await getSubmittedSharesByElection(id);
  if (submittedShares.length < election.threshold) {
    throw new Error(
      `Not enough key shares submitted: ${submittedShares.length}/${election.threshold} required`
    );
  }

  const sharesForReconstruction = submittedShares
    .slice(0, election.threshold)
    .map((s) => ({ x: BigInt(s.shareX), y: BigInt(s.shareY) }));

  const reconstructedLambda = reconstructSecret(sharesForReconstruction);

  const ballots = await getBallotsByElection(id);
  if (ballots.length === 0) {
    throw new Error("No ballots found for this election");
  }

  const candidates = await getCandidatesByElection(id);
  const publicKey = { n: election.paillierPubN, g: election.paillierPubG };

  const results: { candidateId: number; name: string; party: string | null; votes: number }[] = [];

  for (const candidate of candidates) {
    let aggregatedCiphertext = 0n;
    let isFirst = true;

    for (const ballot of ballots) {
      const ciphertexts: string[] = jsonParse(ballot.ciphertexts);
      const ciphertext = BigInt(ciphertexts[candidate.position]);

      if (isFirst) {
        aggregatedCiphertext = ciphertext;
        isFirst = false;
      } else {
        aggregatedCiphertext = homomorphicAdd(aggregatedCiphertext, ciphertext, publicKey);
      }
    }

    const privateKey = {
      lambda: reconstructedLambda.toString(),
      mu: "0",
      n: election.paillierPubN,
    };

    const voteCount = paillierDecrypt(aggregatedCiphertext, privateKey);
    const nBig = BigInt(election.paillierPubN);
    const normalizedVotes = ((voteCount % nBig) + nBig) % nBig;

    results.push({
      candidateId: candidate.id,
      name: candidate.name,
      party: candidate.party,
      votes: Number(normalizedVotes),
    });
  }

  await updateElectionResults(id, JSON.stringify(results));
  await updateElectionStatus(id, "TALLIED");

  return { electionId: id, results, ballotCount: ballots.length };
}
