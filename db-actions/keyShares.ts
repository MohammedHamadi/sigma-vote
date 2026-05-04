import { db } from "@/db";
import { keyShares, type KeyShare, type NewKeyShare } from "@/db/schema";
import { eq, count, and } from "drizzle-orm";

export async function storeKeyShare(
  data: Omit<NewKeyShare, "id" | "submitted">,
): Promise<KeyShare> {
  try {
    const [result] = await db.insert(keyShares).values(data).returning();
    if (!result) throw new Error("Failed to store key share");
    return result;
  } catch (err) {
    console.error("[db-actions] Error storing key share:", err);
    throw err;
  }
}

export async function getSharesByElection(
  electionId: number,
): Promise<KeyShare[]> {
  try {
    return await db
      .select()
      .from(keyShares)
      .where(eq(keyShares.electionId, electionId));
  } catch (err) {
    console.error(
      `[db-actions] Error getting shares for election ${electionId}:`,
      err,
    );
    throw err;
  }
}

export async function getSharesByElectionAndAdmin(
  electionId: number,
  adminId: number,
): Promise<KeyShare[]> {
  try {
    return await db
      .select()
      .from(keyShares)
      .where(
        and(
          eq(keyShares.electionId, electionId),
          eq(keyShares.adminId, adminId),
        ),
      );
  } catch (err) {
    console.error(
      `[db-actions] Error getting shares for election ${electionId} and admin ${adminId}:`,
      err,
    );
    throw err;
  }
}

export async function getSubmittedSharesByElection(
  electionId: number,
): Promise<KeyShare[]> {
  try {
    return await db
      .select()
      .from(keyShares)
      .where(
        and(
          eq(keyShares.electionId, electionId),
          eq(keyShares.submitted, true),
        ),
      );
  } catch (err) {
    console.error(
      `[db-actions] Error getting submitted shares for election ${electionId}:`,
      err,
    );
    throw err;
  }
}

export async function markShareSubmitted(
  id: number,
  shareValue: string,
): Promise<KeyShare> {
  try {
    const [result] = await db
      .update(keyShares)
      .set({ submitted: true, submittedValue: shareValue })
      .where(eq(keyShares.id, id))
      .returning();
    if (!result) throw new Error(`Key share with id ${id} not found`);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error marking key share ${id} submitted:`, err);
    throw err;
  }
}

export async function getShareCount(electionId: number): Promise<number> {
  try {
    const [result] = await db
      .select({ value: count() })
      .from(keyShares)
      .where(
        and(
          eq(keyShares.electionId, electionId),
          eq(keyShares.submitted, true),
        ),
      );
    return result?.value ?? 0;
  } catch (err) {
    console.error(
      `[db-actions] Error getting share count for election ${electionId}:`,
      err,
    );
    throw err;
  }
}
