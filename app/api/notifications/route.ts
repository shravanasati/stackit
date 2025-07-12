import { getAuthUser } from "@/lib/user";
import { getNotificationsByUser, markAllNotificationsRead } from "@/lib/firebase/notifications";
import { getAgoDuration } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await getNotificationsByUser(user.token!);
    notifications.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
    const dateFormattedNotifs = notifications.map((notif) => ({
      ...notif,
      timestamp: getAgoDuration(notif.timestamp.toDate()),
    }));

    markAllNotificationsRead(user.token!);
    return NextResponse.json(dateFormattedNotifs, {
      headers: { "Cache-Control": "max-age=60" }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "An internal server error occurred, try again later." }, { status: 500 });
  }
}
