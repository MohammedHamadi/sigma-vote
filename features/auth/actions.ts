"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/db";
import { voters } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    await signIn("credentials", {
        email,
        password,
        redirect: false, // We'll handle redirect client-side or use Next.js routing
    });
    
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !name || !password) {
    return { error: "Missing required fields" };
  }

  try {
    const existingUser = await db
      .select()
      .from(voters)
      .where(eq(voters.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { error: "Email already in use" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(voters).values({
      name,
      email,
      passwordHash,
      role: "voter",
    });

    // Log them in immediately after creation
    await signIn("credentials", {
        email,
        password,
        redirect: false,
    });
    
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Could not log in automatically." };
    }
    console.error("Registration error:", error);
    return { error: "Failed to properly register." };
  }
}

export async function signOutAction() {
  const { signOut } = await import("@/auth");
  await signOut({ redirectTo: "/" });
}
