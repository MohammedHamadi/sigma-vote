import { db } from "@/db";
import { elections, type Election, type NewElection } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createElection(data: Omit<NewElection, "id" | "createdAt">): Promise<Election> {
  const [result] = await db.insert(elections).values(data).returning();
  if (!result) throw new Error("Failed to create election");
  return result;
}

export async function getElections(): Promise<Election[]> {
  return db.select().from(elections);
}

export async function getElectionById(id: number): Promise<Election | undefined> {
  const [result] = await db.select().from(elections).where(eq(elections.id, id)).limit(1);
  return result;
}

export async function getElectionsByStatus(status: string): Promise<Election[]> {
  return db.select().from(elections).where(eq(elections.status, status));
}

export async function updateElectionStatus(id: number, status: string): Promise<Election> {
  const [result] = await db
    .update(elections)
    .set({ status })
    .where(eq(elections.id, id))
    .returning();
  if (!result) throw new Error(`Election with id ${id} not found`);
  return result;
}

export async function updateElectionKeys(
  id: number,
  keys: {
    paillierPubN: string;
    paillierPubG: string;
    rsaPubE: string;
    rsaPubN: string;
  }
): Promise<Election> {
  const [result] = await db
    .update(elections)
    .set(keys)
    .where(eq(elections.id, id))
    .returning();
  if (!result) throw new Error(`Election with id ${id} not found`);
  return result;
}

export async function updateElectionTimes(
  id: number,
  startTime: Date,
  endTime: Date
): Promise<Election> {
  const [result] = await db
    .update(elections)
    .set({ startTime, endTime })
    .where(eq(elections.id, id))
    .returning();
  if (!result) throw new Error(`Election with id ${id} not found`);
  return result;
}

export async function deleteElection(id: number): Promise<void> {
  const election = await getElectionById(id);
  if (!election) throw new Error(`Election with id ${id} not found`);
  if (election.status !== "SETUP") {
    throw new Error("Can only delete elections in SETUP status");
  }
  await db.delete(elections).where(eq(elections.id, id));
}
