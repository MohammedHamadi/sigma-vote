"use server";

import { getElectionById as dbGetElectionById } from "@/db-actions/elections";
import { getCandidatesByElection } from "@/db-actions/candidates";
import { getBallotCount } from "@/db-actions/ballots";

export async function getResults(electionId: string) {
  const id = parseInt(electionId, 10);
  if (isNaN(id)) throw new Error("Invalid election ID");

  const election = await dbGetElectionById(id);
  if (!election) throw new Error("Election not found");
  if (election.status !== "TALLIED") {
    throw new Error(`Results not available (current status: ${election.status})`);
  }

  const candidates = await getCandidatesByElection(id);
  const ballotCount = await getBallotCount(id);

  let resultsWithVotes = candidates.map((c) => ({
    candidateId: c.id,
    name: c.name,
    party: c.party,
    position: c.position,
    votes: 0,
  }));

  if (election.results) {
    try {
      const storedResults = JSON.parse(election.results) as {
        candidateId: number;
        name: string;
        party: string | null;
        votes: number;
      }[];
      resultsWithVotes = resultsWithVotes.map((c) => {
        const match = storedResults.find((r) => r.candidateId === c.candidateId);
        return match ? { ...c, votes: match.votes } : c;
      });
    } catch {
      // If results JSON is invalid, keep zeros
    }
  }

  resultsWithVotes.sort((a, b) => b.votes - a.votes);

  return {
    election: {
      id: election.id,
      title: election.title,
      status: election.status,
    },
    candidates: resultsWithVotes,
    ballotCount,
  };
}
