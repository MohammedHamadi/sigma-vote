import { db } from "@/db";
import {
  elections,
  candidates,
  keyShares,
  ballots,
  usedTokens,
  blindSigLog,
  electionVoters,
  type Election,
  type NewElection,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createElection(
  data: Omit<NewElection, "id" | "createdAt">,
): Promise<Election> {
  try {
    const [result] = await db.insert(elections).values(data).returning();
    if (!result) throw new Error("Failed to create election");
    return result;
  } catch (err) {
    console.error("[db-actions] Error creating election:", err);
    throw err;
  }
}

export async function getElections(): Promise<Election[]> {
  try {
    return await db.select().from(elections);
  } catch (err) {
    console.error("[db-actions] Error getting elections:", err);
    throw err;
  }
}

export async function getElectionById(
  id: number,
): Promise<Election | undefined> {
  try {
    const [result] = await db
      .select()
      .from(elections)
      .where(eq(elections.id, id))
      .limit(1);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error getting election by id ${id}:`, err);
    throw err;
  }
}

export async function getElectionsByStatus(
  status: string,
): Promise<Election[]> {
  try {
    return await db
      .select()
      .from(elections)
      .where(eq(elections.status, status));
  } catch (err) {
    console.error(
      `[db-actions] Error getting elections by status ${status}:`,
      err,
    );
    throw err;
  }
}

export async function updateElectionStatus(
  id: number,
  status: string,
): Promise<Election> {
  try {
    const [result] = await db
      .update(elections)
      .set({ status })
      .where(eq(elections.id, id))
      .returning();
    if (!result) throw new Error(`Election with id ${id} not found`);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error updating election ${id} status:`, err);
    throw err;
  }
}

export async function updateElectionKeys(
  id: number,
  keys: {
    paillierPubN: string;
    paillierPubG: string;
    rsaPubE: string;
    rsaPubN: string;
    rsaPrivD: string;
  },
): Promise<Election> {
  try {
    const [result] = await db
      .update(elections)
      .set(keys)
      .where(eq(elections.id, id))
      .returning();
    if (!result) throw new Error(`Election with id ${id} not found`);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error updating election ${id} keys:`, err);
    throw err;
  }
}

export async function updateElectionTimes(
  id: number,
  startTime: Date,
  endTime: Date,
): Promise<Election> {
  try {
    const [result] = await db
      .update(elections)
      .set({ startTime, endTime })
      .where(eq(elections.id, id))
      .returning();
    if (!result) throw new Error(`Election with id ${id} not found`);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error updating election ${id} times:`, err);
    throw err;
  }
}

export async function updateElectionResults(
  id: number,
  resultsJson: string,
): Promise<Election> {
  try {
    const [result] = await db
      .update(elections)
      .set({ results: resultsJson })
      .where(eq(elections.id, id))
      .returning();
    if (!result) throw new Error(`Election with id ${id} not found`);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error updating election ${id} results:`, err);
    throw err;
  }
}

export async function deleteElection(id: number): Promise<void> {
  try {
    const election = await getElectionById(id);
    if (!election) throw new Error(`Election with id ${id} not found`);
    // Cascade delete related records (order matters due to FK constraints)
    // Delete in reverse order of dependencies
    await db.delete(usedTokens).where(eq(usedTokens.electionId, id));
    await db.delete(blindSigLog).where(eq(blindSigLog.electionId, id));
    await db.delete(ballots).where(eq(ballots.electionId, id));
    await db.delete(keyShares).where(eq(keyShares.electionId, id));
    await db.delete(electionVoters).where(eq(electionVoters.electionId, id));
    await db.delete(candidates).where(eq(candidates.electionId, id));

    // Finally delete the election
    await db.delete(elections).where(eq(elections.id, id));
  } catch (err) {
    console.error(`[db-actions] Error deleting election ${id}:`, err);
    throw err;
  }
}

export async function updateElectionDetails(
  id: number,
  data: Partial<
    Pick<NewElection, "title" | "description" | "threshold" | "totalShares">
  >,
): Promise<Election> {
  try {
    const [result] = await db
      .update(elections)
      .set(data)
      .where(eq(elections.id, id))
      .returning();
    if (!result) throw new Error(`Election with id ${id} not found`);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error updating election ${id} details:`, err);
    throw err;
  }
}
