import { db } from "./app";
import { notifications } from "./schema";
import { eq, count, and } from "drizzle-orm";

export type NotificationType = {
  user: string,
  title: string,
  description: string,
  status: "unread" | "read",
  link: string,
}

export type DBNotificationType = NotificationType & {
  id: number,
  timestamp: Date,
}

export async function saveNotifications(notificationList: NotificationType[]) {
  if (notificationList.length === 0) return;

  await db.insert(notifications).values(notificationList);
}

export async function getUnreadNotificationCountByUser(userToken: string) {
  const [result] = await db.select({ count: count() })
    .from(notifications)
    .where(
      and(
        eq(notifications.user, userToken),
        eq(notifications.status, "unread")
      )
    );

  return result.count;
}

export async function getNotificationsByUser(userToken: string) {
  const userNotifications = await db.select()
    .from(notifications)
    .where(eq(notifications.user, userToken));

  return userNotifications;
}

export async function markAllNotificationsRead(userToken: string) {
  await db.update(notifications)
    .set({ status: "read" })
    .where(eq(notifications.user, userToken));
}