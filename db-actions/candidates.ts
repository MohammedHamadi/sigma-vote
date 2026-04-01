import { db } from "@/db";
import { candidates, type Candidate, type NewCandidate } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function addCandidate(data: Omit<NewCandidate, "id">): Promise<Candidate> {
  const [result] = await db.insert(candidates).values(data).returning();
  if (!result) throw new Error("Failed to add candidate");
  return result;
}

export async function bulkAddCandidates(data: Omit<NewCandidate, "id">[]): Promise<Candidate[]> {
  if (data.length === 0) throw new Error("No candidates provided");
  const results = await db.insert(candidates).values(data).returning();
  return results;
}

export async function getCandidatesByElection(electionId: number): Promise<Candidate[]> {
  return db
    .select()
    .from(candidates)
    .where(eq(candidates.electionId, electionId))
    .orderBy(candidates.position);
}

export async function getCandidateById(id: number): Promise<Candidate | undefined> {
  const [result] = await db.select().from(candidates).where(eq(candidates.id, id)).limit(1);
  return result;
}

export async function updateCandidate(id: number, data: Partial<NewCandidate>): Promise<Candidate> {
  const [result] = await db
    .update(candidates)
    .set(data)
    .where(eq(candidates.id, id))
    .returning();
  if (!result) throw new Error(`Candidate with id ${id} not found`);
  return result;
}

export async function deleteCandidate(id: number): Promise<void> {
  const candidate = await getCandidateById(id);
  if (!candidate) throw new Error(`Candidate with id ${id} not found`);
  await db.delete(candidates).where(eq(candidates.id, id));
}

export async function getCandidateCount(electionId: number): Promise<number> {
  const [result] = await db
    .select({ value: count() })
    .from(candidates)
    .where(eq(candidates.electionId, electionId));
  return result?.value ?? 0;
}
