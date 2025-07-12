import { db } from "@/lib/database/app";
import { otp, tokens } from "./schema";
import { hash } from "../crypt";
import { eq, count } from "drizzle-orm";

export type OTPEntry = {
  otp: string;
  timestamp: Date;
};

export async function saveOTP(email: string, otpValue: string) {
  await db.insert(otp).values({
    email: email,
    otp: hash(otpValue),
  }).onConflictDoUpdate({
    target: otp.email,
    set: {
      otp: hash(otpValue),
      timestamp: new Date(),
    }
  });
}

export async function getOTP(email: string) {
  const [otpEntry] = await db.select()
    .from(otp)
    .where(eq(otp.email, email))
    .limit(1);

  return otpEntry || null;
}

export async function deleteOTP(email: string) {
  await db.delete(otp).where(eq(otp.email, email));
}

export async function storeToken(token: string, isAdmin: boolean, username: string, email: string) {
  await db.insert(tokens).values({
    token: token,
    role: isAdmin ? "admin" : "user",
    username: username,
    email: email,
  }).onConflictDoUpdate({
    target: tokens.token,
    set: {
      role: isAdmin ? "admin" : "user",
      username: username,
      email: email,
      timestamp: new Date(),
    }
  });
}

export async function deleteToken(token: string) {
  await db.delete(tokens).where(eq(tokens.token, token));
}

export async function getToken(token: string) {
  const [tokenEntry] = await db.select()
    .from(tokens)
    .where(eq(tokens.token, token))
    .limit(1);

  return tokenEntry || null;
}

export async function updateTokenLifetime(token: string, newTimestamp: Date) {
  await db.update(tokens)
    .set({ timestamp: newTimestamp })
    .where(eq(tokens.token, token));
}

export async function getTokenCount() {
  const [result] = await db.select({ count: count() }).from(tokens);
  return result.count;
}

export async function getOTPCount() {
  const [result] = await db.select({ count: count() }).from(otp);
  return result.count;
}