"use server";

import { createHash } from "crypto";
import {
  createElection as dbCreateElection,
  getElectionById as dbGetElectionById,
  updateElectionStatus,
  updateElectionResults,
} from "@/db-actions/elections";
import {
  addCandidate as dbAddCandidate,
  getCandidatesByElection,
  updateCandidate as dbUpdateCandidate,
  deleteCandidate as dbDeleteCandidate,
} from "@/db-actions/candidates";
import {
  storeKeyShare,
  getSubmittedSharesByElection,
  getSharesByElectionAndAdmin,
  markShareSubmitted,
} from "@/db-actions/keyShares";
import { getBallotsByElection } from "@/db-actions/ballots";
import {
  generatePaillierKeypair,
  paillierDecrypt,
  homomorphicAdd,
} from "@/lib/crypto/paillier";
import { generateRSAKeyPair } from "@/lib/crypto/blind-signature";
import { splitSecret, reconstructSecret } from "@/lib/crypto/shamir";
import { modPow, modInverse } from "@/lib/crypto/bigint-utils";
import { jsonParse } from "@/lib/db-utils";
import {
  updateVoter,
  getAllVoters,
  searchVoters,
  getVotersWithPagination,
  getVoterById,
} from "@/db-actions/voters";
import { bulkAddElectionVoters } from "@/db-actions/electionVoters";
import { sendShareEmail } from "@/lib/email";

export async function createElection(data: {
  title: string;
  description: string;
  threshold: number;
  totalShares: number;
  startTime?: string;
  endTime?: string;
  adminIds: number[];
  voterIds?: number[];
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

  for (let i = 0; i < data.adminIds.length; i++) {
    const shareX = parseInt(shares[i].x.toString(), 10);
    const shareY = shares[i].y.toString();
    const commitment = createHash("sha256").update(shareY).digest("hex");

    await storeKeyShare({
      electionId: election.id,
      adminId: data.adminIds[i],
      shareX: shareX as number,
      shareCommitment: commitment,
    });

    // Send share via email to the admin
    const admin = await getVoterById(data.adminIds[i]);
    if (admin?.email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await sendShareEmail(
          admin.email,
          data.title,
          parseInt(shares[i].x.toString(), 10),
          shareY,
        );
      } catch (err) {
        console.error(
          `Failed to send share email to admin ${data.adminIds[i]}:`,
          err,
        );
      }
    }
  }

  // Store allowed voters if specified
  if (data.voterIds && data.voterIds.length > 0) {
    const electionVoterData = data.voterIds.map((voterId) => ({
      electionId: election.id,
      voterId,
    }));
    await bulkAddElectionVoters(electionVoterData);
  }

  return { election };
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

export async function addCandidate(
  electionId: string,
  data: { name: string; party?: string; position: number },
) {
  const id = parseInt(electionId, 10);
  if (isNaN(id)) throw new Error("Invalid election ID");

  const election = await dbGetElectionById(id);
  if (!election) throw new Error("Election not found");
  if (election.status !== "SETUP") {
    throw new Error("Can only add candidates during SETUP");
  }

  return dbAddCandidate({
    electionId: id,
    name: data.name,
    party: data.party ?? null,
    position: data.position,
  });
}

export async function updateCandidate(
  electionId: string,
  candidateId: string,
  data: { name?: string; party?: string; position?: number },
) {
  const eId = parseInt(electionId, 10);
  const cId = parseInt(candidateId, 10);
  if (isNaN(eId) || isNaN(cId)) throw new Error("Invalid IDs");

  const election = await dbGetElectionById(eId);
  if (!election) throw new Error("Election not found");
  if (election.status !== "SETUP") {
    throw new Error("Can only edit candidates during SETUP");
  }

  return dbUpdateCandidate(cId, {
    name: data.name,
    party: data.party,
    position: data.position,
  });
}

export async function deleteCandidateAction(
  electionId: string,
  candidateId: string,
) {
  const eId = parseInt(electionId, 10);
  const cId = parseInt(candidateId, 10);
  if (isNaN(eId) || isNaN(cId)) throw new Error("Invalid IDs");

  const election = await dbGetElectionById(eId);
  if (!election) throw new Error("Election not found");
  if (election.status !== "SETUP") {
    throw new Error("Can only delete candidates during SETUP");
  }

  return dbDeleteCandidate(cId);
}

export async function reorderCandidates(
  electionId: string,
  candidateIds: number[],
) {
  const eId = parseInt(electionId, 10);
  if (isNaN(eId)) throw new Error("Invalid election ID");

  const election = await dbGetElectionById(eId);
  if (!election) throw new Error("Election not found");
  if (election.status !== "SETUP") {
    throw new Error("Can only reorder candidates during SETUP");
  }

  const candidates = await getCandidatesByElection(eId);
  const updates = candidateIds.map((id, index) => {
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) throw new Error(`Candidate ${id} not found`);
    return dbUpdateCandidate(id, { position: index });
  });

  return Promise.all(updates);
}

export async function submitKeyShare(
  electionId: string,
  adminId: string,
  shareValue: string,
) {
  const eId = parseInt(electionId, 10);
  const aId = parseInt(adminId, 10);
  if (isNaN(eId) || isNaN(aId)) throw new Error("Invalid IDs");
  if (!shareValue || shareValue.trim().length === 0) {
    throw new Error("Share value is required");
  }

  const election = await dbGetElectionById(eId);
  if (!election) throw new Error("Election not found");

  const submitted = await getSubmittedSharesByElection(eId);
  const alreadySubmitted = submitted.some((s) => s.adminId === aId);
  if (alreadySubmitted) {
    throw new Error("Admin has already submitted their key share");
  }

  const adminShares = await getSharesByElectionAndAdmin(eId, aId);
  if (adminShares.length === 0) {
    throw new Error("No key share assigned to this admin for this election");
  }

  // Verify the submitted share against the stored commitment
  const commitment = createHash("sha256")
    .update(shareValue.trim())
    .digest("hex");
  if (commitment !== adminShares[0].shareCommitment) {
    throw new Error(
      "Invalid share value: does not match the stored commitment",
    );
  }

  const updated = await markShareSubmitted(
    adminShares[0].id,
    shareValue.trim(),
  );

  const newCount = submitted.length + 1;
  const thresholdMet = newCount >= election.threshold;

  return {
    share: updated,
    thresholdMet,
    submittedCount: newCount,
    threshold: election.threshold,
  };
}

export async function updateVoterRole(voterId: string, role: string) {
  const id = parseInt(voterId, 10);
  if (isNaN(id)) throw new Error("Invalid voter ID");
  if (role !== "voter" && role !== "admin") {
    throw new Error("Invalid role. Must be 'voter' or 'admin'");
  }
  return updateVoter(id, { role });
}

export async function searchVotersAction(query: string, limit: number = 50) {
  if (!query || query.trim().length === 0) {
    return [];
  }
  return searchVoters(query.trim(), limit);
}

export async function getVotersPageAction(
  page: number = 1,
  pageSize: number = 50,
  search?: string,
) {
  return getVotersWithPagination(page, pageSize, search);
}

export async function getAllVotersAction() {
  return getAllVoters();
}

export async function deleteElectionAction(electionId: string) {
  const id = parseInt(electionId, 10);
  if (isNaN(id)) throw new Error("Invalid election ID");

  const { deleteElection } = await import("@/db-actions/elections");
  return deleteElection(id);
}

export async function tally(electionId: string) {
  const id = parseInt(electionId, 10);
  if (isNaN(id)) throw new Error("Invalid election ID");

  const election = await dbGetElectionById(id);
  if (!election) throw new Error("Election not found");
  if (election.status !== "CLOSED") {
    throw new Error(
      `Can only tally CLOSED elections (current: ${election.status})`,
    );
  }

  const submittedShares = await getSubmittedSharesByElection(id);
  if (submittedShares.length < election.threshold) {
    throw new Error(
      `Not enough key shares submitted: ${submittedShares.length}/${election.threshold} required`,
    );
  }

  const sharesForReconstruction = submittedShares
    .slice(0, election.threshold)
    .filter((s) => s.submittedValue != null)
    .map((s) => ({ x: BigInt(s.shareX), y: BigInt(s.submittedValue!) }));

  const reconstructedLambda = reconstructSecret(sharesForReconstruction);

  // Recompute mu from reconstructed lambda:
  //   mu = (L(g^lambda mod n^2))^-1 mod n,   where L(x) = (x-1)/n
  // The server never stores mu; deriving it on demand from lambda + public (n,g)
  // is required for paillierDecrypt to produce correct plaintexts.
  const nBigForMu = BigInt(election.paillierPubN);
  const gBigForMu = BigInt(election.paillierPubG);
  const n2ForMu = nBigForMu * nBigForMu;
  const lOfGLambda =
    (modPow(gBigForMu, reconstructedLambda, n2ForMu) - 1n) / nBigForMu;
  const reconstructedMu = modInverse(lOfGLambda, nBigForMu);

  const ballots = await getBallotsByElection(id);
  if (ballots.length === 0) {
    throw new Error("No ballots found for this election");
  }

  const candidates = await getCandidatesByElection(id);
  const publicKey = { n: election.paillierPubN, g: election.paillierPubG };

  const results: {
    candidateId: number;
    name: string;
    party: string | null;
    votes: number;
  }[] = [];

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
        aggregatedCiphertext = homomorphicAdd(
          aggregatedCiphertext,
          ciphertext,
          publicKey,
        );
      }
    }

    const privateKey = {
      lambda: reconstructedLambda.toString(),
      mu: reconstructedMu.toString(),
      n: election.paillierPubN,
    };

    const voteCount = paillierDecrypt(aggregatedCiphertext, privateKey);
    const normalizedVotes = ((voteCount % nBigForMu) + nBigForMu) % nBigForMu;

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
