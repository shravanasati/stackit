import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/lib/database/app";
import { hash } from "../crypt";

export type OTPEntry = {
  otp: string;
  timestamp: Timestamp;
};

export async function saveOTP(email: string, otp: string) {
  const otpRef = db.collection("otp").doc(email)
  await otpRef.set({
    otp: hash(otp),
    timestamp: Timestamp.now(),
  });

}

export async function getOTP(email: string) {
  const otpRef = db.collection("otp").doc(email)
  const otpSnap = await otpRef.get()

  if (otpSnap.exists) {
    return otpSnap.data() as OTPEntry;
  }

  return null;
}

export async function deleteOTP(email: string) {
  const otpRef = db.collection("otp").doc(email)
  await otpRef.delete();
}

export async function storeToken(token: string, isAdmin: boolean, username: string, email: string) {
  const tokenRef = db.collection("tokens").doc(token);
  await tokenRef.set({
    token: token,
    role: isAdmin ? "admin" : "user",
    username: username,
    email: email,
    timestamp: Timestamp.now(),
  });
}

export async function deleteToken(token: string) {
  const tokenRef = db.collection("tokens").doc(token);
  await tokenRef.delete();
}

export async function getToken(token: string) {
  const tokenRef = db.collection("tokens").doc(token);
  const tokenSnap = await tokenRef.get();

  if (tokenSnap.exists) {
    return tokenSnap.data();
  }

  return null;
}

export async function updateTokenLifetime(token: string, newTimestamp: Timestamp) {
  const tokenRef = db.collection("tokens").doc(token);
  await tokenRef.update({
    timestamp: newTimestamp,
  });
}

export async function getTokenCount() {
  const tokenRef = db.collection("tokens");
  const tokenSnap = await tokenRef.count().get();

  return tokenSnap.data().count;
}

export async function getOTPCount() {
  const otpRef = db.collection("otp");
  const otpSnap = await otpRef.count().get();

  return otpSnap.data().count;
}