import { db } from "@/db";
import { voters, type Voter, type NewVoter } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createVoter(data: Omit<NewVoter, "id" | "createdAt">): Promise<Voter> {
  try {
    const [result] = await db.insert(voters).values(data).returning();
    if (!result) throw new Error("Failed to create voter");
    return result;
  } catch (err) {
    console.error("[db-actions] Error creating voter:", err);
    throw err;
  }
}

export async function getVoterByEmail(email: string): Promise<Voter | undefined> {
  try {
    const [result] = await db.select().from(voters).where(eq(voters.email, email)).limit(1);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error getting voter by email ${email}:`, err);
    throw err;
  }
}

export async function getVoterById(id: number): Promise<Voter | undefined> {
  try {
    const [result] = await db.select().from(voters).where(eq(voters.id, id)).limit(1);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error getting voter by id ${id}:`, err);
    throw err;
  }
}

export async function getVotersByRole(role: string): Promise<Voter[]> {
  try {
    return await db.select().from(voters).where(eq(voters.role, role));
  } catch (err) {
    console.error(`[db-actions] Error getting voters by role ${role}:`, err);
    throw err;
  }
}

export async function updateVoterPassword(id: number, newPasswordHash: string): Promise<void> {
  try {
    const result = await db.update(voters).set({ passwordHash: newPasswordHash }).where(eq(voters.id, id));
    if (result.rowCount === 0) throw new Error(`Voter with id ${id} not found`);
  } catch (err) {
    console.error(`[db-actions] Error updating password for voter ${id}:`, err);
    throw err;
  }
}

export async function getAllVoters(): Promise<Voter[]> {
  try {
    return await db.select().from(voters);
  } catch (err) {
    console.error("[db-actions] Error getting all voters:", err);
    throw err;
  }
}

export async function updateVoter(id: number, data: Partial<NewVoter>): Promise<Voter> {
  try {
    const [result] = await db
      .update(voters)
      .set(data)
      .where(eq(voters.id, id))
      .returning();
    if (!result) throw new Error(`Voter with id ${id} not found`);
    return result;
  } catch (err) {
    console.error(`[db-actions] Error updating voter ${id}:`, err);
    throw err;
  }
}

export async function deleteVoter(id: number): Promise<void> {
  try {
    await db.delete(voters).where(eq(voters.id, id));
  } catch (err) {
    console.error(`[db-actions] Error deleting voter ${id}:`, err);
    throw err;
  }
}
