"use server";

import { auth } from "@/auth";
import {
  getElections as dbGetElections,
  getElectionById as dbGetElectionById,
} from "@/db-actions/elections";
import { getCandidatesByElection } from "@/db-actions/candidates";
import { getElectionVoterIdsByElection } from "@/db-actions/electionVoters";

export async function getElections() {
  const allElections = await dbGetElections();

  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;
  const userRole = session?.user?.role;

  // Admins can see all elections
  if (userRole === "admin") {
    return allElections;
  }

  // For regular voters, filter to only show elections they are allowed to vote in
  // or elections that have no voter restrictions (no voters in election_voters table)
  const filteredElections: typeof allElections = [];

  for (const election of allElections) {
    const allowedVoterIds = await getElectionVoterIdsByElection(election.id);

    // If no voters are restricted for this election, show it to everyone
    if (allowedVoterIds.length === 0) {
      filteredElections.push(election);
      continue;
    }

    // If the user is in the allowed list, show the election
    if (userId && allowedVoterIds.includes(userId)) {
      filteredElections.push(election);
    }
  }

  return filteredElections;
}

export async function getElectionById(electionId: string) {
  const id = parseInt(electionId, 10);
  if (isNaN(id)) throw new Error("Invalid election ID");

  const election = await dbGetElectionById(id);
  if (!election) throw new Error("Election not found");

  const candidates = await getCandidatesByElection(id);

  // Get additional metadata for the current user
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;
  const userRole = session?.user?.role;

  const allowedVoterIds = await getElectionVoterIdsByElection(id);
  const isRestricted = allowedVoterIds.length > 0;
  const isAllowed = userId ? allowedVoterIds.includes(userId) : false;

  return {
    election,
    candidates,
    permissions: {
      canView: userRole === "admin" || !isRestricted || isAllowed,
      canVote:
        (userRole === "voter" || userRole === "admin") &&
        (!isRestricted || isAllowed),
      isRestricted,
      isAllowed,
    },
  };
}
