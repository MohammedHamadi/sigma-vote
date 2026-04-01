import { db } from "@/db";
import { usedTokens } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { hashToken } from "@/lib/db-utils";

export async function markTokenUsed(electionId: number, token: string): Promise<void> {
  const tokenHash = hashToken(token);
  await db.insert(usedTokens).values({ tokenHash, electionId });
}

export async function isTokenUsed(tokenHash: string): Promise<boolean> {
  const [result] = await db
    .select()
    .from(usedTokens)
    .where(eq(usedTokens.tokenHash, tokenHash))
    .limit(1);
  return !!result;
}

export async function isTokenUsedInElection(token: string, electionId: number): Promise<boolean> {
  const tokenHash = hashToken(token);
  const [result] = await db
    .select()
    .from(usedTokens)
    .where(eq(usedTokens.tokenHash, tokenHash) && eq(usedTokens.electionId, electionId))
    .limit(1);
  return !!result;
}

export async function getTokenCount(electionId: number): Promise<number> {
  const [result] = await db
    .select({ value: count() })
    .from(usedTokens)
    .where(eq(usedTokens.electionId, electionId));
  return result?.value ?? 0;
}
