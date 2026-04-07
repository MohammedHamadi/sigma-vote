import { db } from "@/db";
import { ballots, type Ballot, type NewBallot } from "@/db/schema";
import { eq, count, and } from "drizzle-orm";

export async function insertBallot(data: Omit<NewBallot, "id" | "submittedAt">): Promise<Ballot> {
  try {
    const [result] = await db.insert(ballots).values(data).returning();
    if (!result) throw new Error("Failed to insert ballot");
    return result;
  } catch (err) {
    console.error(`[db-actions] Error inserting ballot for election ${data.electionId}:`, err);
    throw err;
  }
}

export async function getBallotsByElection(electionId: number): Promise<Ballot[]> {
  try {
    return await db.select().from(ballots).where(eq(ballots.electionId, electionId));
  } catch (err) {
    console.error(`[db-actions] Error getting ballots for election ${electionId}:`, err);
    throw err;
  }
}

export async function getBallotCount(electionId: number): Promise<number> {
  try {
    const [result] = await db
      .select({ value: count() })
      .from(ballots)
      .where(eq(ballots.electionId, electionId));
    return result?.value ?? 0;
  } catch (err) {
    console.error(`[db-actions] Error getting ballot count for election ${electionId}:`, err);
    throw err;
  }
}

export async function getBallotById(id: number): Promise<Ballot | undefined> {
  try {
    const [result] = await db.select().from(ballots).where(eq(ballots.id, id)).limit(1);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error getting ballot by id ${id}:`, err);
    throw err;
  }
}

export async function getBallotByToken(electionId: number, ballotToken: string): Promise<Ballot | undefined> {
  try {
    const [result] = await db
      .select()
      .from(ballots)
      .where(and(eq(ballots.electionId, electionId), eq(ballots.ballotToken, ballotToken)))
      .limit(1);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error getting ballot by token for election ${electionId}:`, err);
    throw err;
  }
}
