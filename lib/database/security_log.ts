import { db } from "@/lib/database/app";
import { security_logs } from "./schema";
import { desc } from "drizzle-orm";

interface SecurityLog {
  type_: "admin_login" | "moderation_action"
  detail: string
}

export async function addSecurityLog(log: SecurityLog) {
  await db.insert(security_logs).values({
    type_: log.type_,
    detail: log.detail,
  });
}

export async function getSecurityLogs() {
  const logs = await db.select()
    .from(security_logs)
    .orderBy(desc(security_logs.timestamp))
    .limit(20);

  return logs;
}