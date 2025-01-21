'use server';

import { signIn } from "@/auth";
import { db } from "@/database/dizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import config from "../config";
import { workflowclient } from "../workflow";

export const signInWithCredential = async (params: Pick<AuthCredentials, "email" | "password">) => {
  const { email, password } = params;

  const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");

  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error('Signin error:', error);
    return { success: false, error: "Signin error" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullname, email, universityId, password, universityCard } = params;

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "User already exists" };
    }

    const hashedPassword = await hash(password, 10);

    try {
      const insertResult = await db.insert(users).values({
        fullname,
        email,
        universityId,
        password: hashedPassword,
        universityCard,
      });
      if (insertResult.rowCount === 0) {
        return { success: false, error: "Failed to register user" };
      }

      await signInWithCredential({ email, password });

      return { success: true, message: "User registered and signed in successfully" };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: "Signup error" };
    }
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: "Database error" };
  }
};
