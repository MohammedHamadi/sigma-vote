import { db } from "@/db";
import { blindSigLog } from "@/db/schema";
import { eq, count, and } from "drizzle-orm";

export async function logBlindSig(electionId: number, voterId: number): Promise<void> {
  try {
    await db.insert(blindSigLog).values({ electionId, voterId });
  } catch (err) {
    console.error(`[db-actions] Error logging blind sig for election ${electionId}, voter ${voterId}:`, err);
    throw err;
  }
}

export async function hasVoterReceivedSig(electionId: number, voterId: number): Promise<boolean> {
  try {
    const [result] = await db
      .select()
      .from(blindSigLog)
      .where(and(eq(blindSigLog.electionId, electionId), eq(blindSigLog.voterId, voterId)))
      .limit(1);
    return !!result;
  } catch (err) {
    console.error(`[db-actions] Error checking signature for election ${electionId}, voter ${voterId}:`, err);
    throw err;
  }
}

export async function getSigCountByElection(electionId: number): Promise<number> {
  try {
    const [result] = await db
      .select({ value: count() })
      .from(blindSigLog)
      .where(eq(blindSigLog.electionId, electionId));
    return result?.value ?? 0;
  } catch (err) {
    console.error(`[db-actions] Error getting sig count for election ${electionId}:`, err);
    throw err;
  }
}
