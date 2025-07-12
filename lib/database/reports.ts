import { db } from "./app";
import { reports } from "./schema";
import { eq } from "drizzle-orm";

export type Report = {
  post_id: string,
  comment_id?: string,
  flag: string,
  status: "pending" | "resolved",
}

export type DBReport = Report & {
  report_id: string
  created_at: Date,
  resolved_at: Date | null,
}

export async function reportContent(report: Report) {
  const reportID = `${report.post_id || report.comment_id || ""}_${Date.now()}`;

  await db.insert(reports).values({
    report_id: reportID,
    post_id: report.post_id,
    comment_id: report.comment_id || null,
    flag: report.flag,
    status: report.status,
  });
}

export async function getUnresolvedReports() {
  const unresolvedReports = await db.select()
    .from(reports)
    .where(eq(reports.status, "pending"));

  return unresolvedReports as DBReport[];
}

export async function resolveReport(reportID: string) {
  // Get the report to find the post ID
  const [report] = await db.select()
    .from(reports)
    .where(eq(reports.report_id, reportID))
    .limit(1);

  if (!report) return;

  // Update all reports for this post
  await db.update(reports)
    .set({
      status: "resolved",
      resolved_at: new Date()
    })
    .where(eq(reports.post_id, report.post_id));
}