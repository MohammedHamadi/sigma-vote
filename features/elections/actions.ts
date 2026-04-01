"use server";

import { getElections as dbGetElections, getElectionById as dbGetElectionById } from "@/db-actions/elections";
import { getCandidatesByElection } from "@/db-actions/candidates";

export async function getElections() {
  return dbGetElections();
}

export async function getElectionById(electionId: string) {
  const id = parseInt(electionId, 10);
  if (isNaN(id)) throw new Error("Invalid election ID");

  const election = await dbGetElectionById(id);
  if (!election) throw new Error("Election not found");

  const candidates = await getCandidatesByElection(id);

  return { election, candidates };
}
