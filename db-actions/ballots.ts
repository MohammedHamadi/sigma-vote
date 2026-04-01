import { db } from "@/db";
import { ballots, type Ballot, type NewBallot } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function insertBallot(data: Omit<NewBallot, "id" | "submittedAt">): Promise<Ballot> {
  const [result] = await db.insert(ballots).values(data).returning();
  if (!result) throw new Error("Failed to insert ballot");
  return result;
}

export async function getBallotsByElection(electionId: number): Promise<Ballot[]> {
  return db.select().from(ballots).where(eq(ballots.electionId, electionId));
}

export async function getBallotCount(electionId: number): Promise<number> {
  const [result] = await db
    .select({ value: count() })
    .from(ballots)
    .where(eq(ballots.electionId, electionId));
  return result?.value ?? 0;
}

export async function getBallotById(id: number): Promise<Ballot | undefined> {
  const [result] = await db.select().from(ballots).where(eq(ballots.id, id)).limit(1);
  return result;
}
