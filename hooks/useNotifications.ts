import { DBNotificationType } from "@/lib/firebase/notifications";
import { useEffect, useState } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState<DBNotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await fetch("/api/notifications", { credentials: "include" }).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch notifications");
          }
          return res.json();
        });
        setNotifications(data);
        setUnreadCount(data.filter((n: DBNotificationType) => n.status === "unread").length);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return { notifications, loading, error, unreadCount, setUnreadCount };
}
