"use server";

import { auth } from "@/auth";
import {
  getElections as dbGetElections,
  getElectionById as dbGetElectionById,
} from "@/db-actions/elections";
import { getCandidatesByElection } from "@/db-actions/candidates";
import {
  getElectionVoterIdsByElection,
  getElectionVoterMappingsByElections,
} from "@/db-actions/electionVoters";

export async function getElections() {
  return await dbGetElections();
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
      canView: true,
      canVote:
        (userRole === "voter" || userRole === "admin") &&
        (!isRestricted || isAllowed),
      isRestricted,
      isAllowed,
    },
  };
}
