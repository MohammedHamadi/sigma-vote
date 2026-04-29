import { db } from "@/db";
import { usedTokens } from "@/db/schema";
import { eq, count, and } from "drizzle-orm";
import { hashToken } from "@/lib/db-utils";

export async function markTokenUsed(electionId: number, token: string): Promise<void> {
  try {
    const tokenHash = hashToken(token);
    await db.insert(usedTokens).values({ tokenHash, electionId });
  } catch (err) {
    console.error(`[db-actions] Error marking token used in election ${electionId}:`, err);
    throw err;
  }
}

export async function isTokenUsed(tokenHash: string): Promise<boolean> {
  try {
    const [result] = await db
      .select()
      .from(usedTokens)
      .where(eq(usedTokens.tokenHash, tokenHash))
      .limit(1);
    return !!result;
  } catch (err) {
    console.error(`[db-actions] Error checking if token is used:`, err);
    throw err;
  }
}

export async function isTokenUsedInElection(token: string, electionId: number): Promise<boolean> {
  try {
    const tokenHash = hashToken(token);
    const [result] = await db
      .select()
      .from(usedTokens)
      .where(and(eq(usedTokens.tokenHash, tokenHash), eq(usedTokens.electionId, electionId)))
      .limit(1);
    return !!result;
  } catch (err) {
    console.error(`[db-actions] Error checking if token is used in election ${electionId}:`, err);
    throw err;
  }
}

export async function getTokenCount(electionId: number): Promise<number> {
  try {
    const [result] = await db
      .select({ value: count() })
      .from(usedTokens)
      .where(eq(usedTokens.electionId, electionId));
    return result?.value ?? 0;
  } catch (err) {
    console.error(`[db-actions] Error getting token count for election ${electionId}:`, err);
    throw err;
  }
}
