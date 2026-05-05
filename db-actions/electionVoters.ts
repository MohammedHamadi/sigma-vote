import { db } from "@/db";
import {
  electionVoters,
  voters,
  type ElectionVoter,
  type NewElectionVoter,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function addElectionVoter(
  data: NewElectionVoter,
): Promise<ElectionVoter> {
  try {
    const [result] = await db.insert(electionVoters).values(data).returning();
    if (!result) throw new Error("Failed to add election voter");
    return result;
  } catch (err) {
    console.error("[db-actions] Error adding election voter:", err);
    throw err;
  }
}

export async function bulkAddElectionVoters(
  data: NewElectionVoter[],
): Promise<ElectionVoter[]> {
  try {
    if (data.length === 0) return [];
    return await db.insert(electionVoters).values(data).returning();
  } catch (err) {
    console.error("[db-actions] Error bulk adding election voters:", err);
    throw err;
  }
}

export async function getElectionVotersByElection(
  electionId: number,
): Promise<ElectionVoter[]> {
  try {
    return await db
      .select()
      .from(electionVoters)
      .where(eq(electionVoters.electionId, electionId));
  } catch (err) {
    console.error(
      `[db-actions] Error getting election voters for election ${electionId}:`,
      err,
    );
    throw err;
  }
}

export async function getElectionVoterIdsByElection(
  electionId: number,
): Promise<number[]> {
  try {
    const rows = await db
      .select({ voterId: electionVoters.voterId })
      .from(electionVoters)
      .where(eq(electionVoters.electionId, electionId));
    return rows.map((r) => r.voterId);
  } catch (err) {
    console.error(
      `[db-actions] Error getting voter IDs for election ${electionId}:`,
      err,
    );
    throw err;
  }
}

export async function getElectionVoterMappingsByElections(
  electionIds: number[],
): Promise<{ electionId: number; voterId: number }[]> {
  try {
    if (electionIds.length === 0) return [];
    return await db
      .select({
        electionId: electionVoters.electionId,
        voterId: electionVoters.voterId,
      })
      .from(electionVoters)
      .where(inArray(electionVoters.electionId, electionIds));
  } catch (err) {
    console.error(
      `[db-actions] Error getting voter mappings for multiple elections:`,
      err,
    );
    throw err;
  }
}

export async function deleteElectionVotersByElection(
  electionId: number,
): Promise<void> {
  try {
    await db
      .delete(electionVoters)
      .where(eq(electionVoters.electionId, electionId));
  } catch (err) {
    console.error(
      `[db-actions] Error deleting election voters for election ${electionId}:`,
      err,
    );
    throw err;
  }
}

export async function getElectionVotersWithDetails(
  electionId: number,
): Promise<{ id: number; name: string; email: string; role: string | null }[]> {
  try {
    const rows = await db
      .select({
        id: voters.id,
        name: voters.name,
        email: voters.email,
        role: voters.role,
      })
      .from(electionVoters)
      .innerJoin(voters, eq(electionVoters.voterId, voters.id))
      .where(eq(electionVoters.electionId, electionId));
    return rows;
  } catch (err) {
    console.error(
      `[db-actions] Error getting election voters with details for election ${electionId}:`,
      err,
    );
    throw err;
  }
}

export async function isVoterAllowed(
  electionId: number,
  voterId: number,
): Promise<boolean> {
  try {
    const rows = await db
      .select()
      .from(electionVoters)
      .where(
        inArray(electionVoters.electionId, [electionId]) &&
          inArray(electionVoters.voterId, [voterId]),
      )
      .limit(1);
    return rows.length > 0;
  } catch (err) {
    console.error(
      `[db-actions] Error checking voter ${voterId} for election ${electionId}:`,
      err,
    );
    throw err;
  }
}
