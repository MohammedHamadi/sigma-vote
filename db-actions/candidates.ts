import { db } from "@/db";
import { candidates, type Candidate, type NewCandidate } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function addCandidate(data: Omit<NewCandidate, "id">): Promise<Candidate> {
  try {
    const [result] = await db.insert(candidates).values(data).returning();
    if (!result) throw new Error("Failed to add candidate");
    return result;
  } catch (err) {
    console.error("[db-actions] Error adding candidate:", err);
    throw err;
  }
}

export async function bulkAddCandidates(data: Omit<NewCandidate, "id">[]): Promise<Candidate[]> {
  try {
    if (data.length === 0) throw new Error("No candidates provided");
    const results = await db.insert(candidates).values(data).returning();
    return results;
  } catch (err) {
    console.error("[db-actions] Error bulk adding candidates:", err);
    throw err;
  }
}

export async function getCandidatesByElection(electionId: number): Promise<Candidate[]> {
  try {
    return await db
      .select()
      .from(candidates)
      .where(eq(candidates.electionId, electionId))
      .orderBy(candidates.position);
  } catch (err) {
    console.error(`[db-actions] Error getting candidates for election ${electionId}:`, err);
    throw err;
  }
}

export async function getCandidateById(id: number): Promise<Candidate | undefined> {
  try {
    const [result] = await db.select().from(candidates).where(eq(candidates.id, id)).limit(1);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error getting candidate by id ${id}:`, err);
    throw err;
  }
}

export async function updateCandidate(id: number, data: Partial<NewCandidate>): Promise<Candidate> {
  try {
    const [result] = await db
      .update(candidates)
      .set(data)
      .where(eq(candidates.id, id))
      .returning();
    if (!result) throw new Error(`Candidate with id ${id} not found`);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error updating candidate ${id}:`, err);
    throw err;
  }
}

export async function deleteCandidate(id: number): Promise<void> {
  try {
    const candidate = await getCandidateById(id);
    if (!candidate) throw new Error(`Candidate with id ${id} not found`);
    await db.delete(candidates).where(eq(candidates.id, id));
  } catch (err) {
    console.error(`[db-actions] Error deleting candidate ${id}:`, err);
    throw err;
  }
}

export async function getCandidateCount(electionId: number): Promise<number> {
  try {
    const [result] = await db
      .select({ value: count() })
      .from(candidates)
      .where(eq(candidates.electionId, electionId));
    return result?.value ?? 0;
  } catch (err) {
    console.error(`[db-actions] Error getting candidate count for election ${electionId}:`, err);
    throw err;
  }
}
