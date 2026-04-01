import { db } from "@/db";
import { voters, type Voter, type NewVoter } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createVoter(data: Omit<NewVoter, "id" | "createdAt">): Promise<Voter> {
  const [result] = await db.insert(voters).values(data).returning();
  if (!result) throw new Error("Failed to create voter");
  return result;
}

export async function getVoterByEmail(email: string): Promise<Voter | undefined> {
  const [result] = await db.select().from(voters).where(eq(voters.email, email)).limit(1);
  return result;
}

export async function getVoterById(id: number): Promise<Voter | undefined> {
  const [result] = await db.select().from(voters).where(eq(voters.id, id)).limit(1);
  return result;
}

export async function getVotersByRole(role: string): Promise<Voter[]> {
  return db.select().from(voters).where(eq(voters.role, role));
}

export async function updateVoterPassword(id: number, newPasswordHash: string): Promise<void> {
  const result = await db.update(voters).set({ passwordHash: newPasswordHash }).where(eq(voters.id, id));
  if (result.rowCount === 0) throw new Error(`Voter with id ${id} not found`);
}

export async function getAllVoters(): Promise<Voter[]> {
  return db.select().from(voters);
}
