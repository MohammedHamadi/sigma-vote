import { db } from "@/db";
import { keyShares, type KeyShare, type NewKeyShare } from "@/db/schema";
import { eq, count, and } from "drizzle-orm";

export async function storeKeyShare(data: Omit<NewKeyShare, "id" | "submitted">): Promise<KeyShare> {
  const [result] = await db.insert(keyShares).values(data).returning();
  if (!result) throw new Error("Failed to store key share");
  return result;
}

export async function getSharesByElection(electionId: number): Promise<KeyShare[]> {
  return db.select().from(keyShares).where(eq(keyShares.electionId, electionId));
}

export async function getSharesByElectionAndAdmin(electionId: number, adminId: number): Promise<KeyShare[]> {
  return db
    .select()
    .from(keyShares)
    .where(and(eq(keyShares.electionId, electionId), eq(keyShares.adminId, adminId)));
}

export async function getSubmittedSharesByElection(electionId: number): Promise<KeyShare[]> {
  return db
    .select()
    .from(keyShares)
    .where(and(eq(keyShares.electionId, electionId), eq(keyShares.submitted, true)));
}

export async function markShareSubmitted(id: number): Promise<KeyShare> {
  const [result] = await db
    .update(keyShares)
    .set({ submitted: true })
    .where(eq(keyShares.id, id))
    .returning();
  if (!result) throw new Error(`Key share with id ${id} not found`);
  return result;
}

export async function getShareCount(electionId: number): Promise<number> {
  const [result] = await db
    .select({ value: count() })
    .from(keyShares)
    .where(and(eq(keyShares.electionId, electionId), eq(keyShares.submitted, true)));
  return result?.value ?? 0;
}
