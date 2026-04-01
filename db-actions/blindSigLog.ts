import { db } from "@/db";
import { blindSigLog } from "@/db/schema";
import { eq, count, and } from "drizzle-orm";

export async function logBlindSig(electionId: number, voterId: number): Promise<void> {
  await db.insert(blindSigLog).values({ electionId, voterId });
}

export async function hasVoterReceivedSig(electionId: number, voterId: number): Promise<boolean> {
  const [result] = await db
    .select()
    .from(blindSigLog)
    .where(and(eq(blindSigLog.electionId, electionId), eq(blindSigLog.voterId, voterId)))
    .limit(1);
  return !!result;
}

export async function getSigCountByElection(electionId: number): Promise<number> {
  const [result] = await db
    .select({ value: count() })
    .from(blindSigLog)
    .where(eq(blindSigLog.electionId, electionId));
  return result?.value ?? 0;
}
