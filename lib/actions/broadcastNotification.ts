"use server"

import { z } from "zod"
import { getAuthUser } from "@/lib/user"
import { saveNotifications } from "@/lib/database/notifications"
import { getAllUsers } from "@/lib/database/firestore"


const formSchema = z.strictObject({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }).max(100, {
    message: 'Title must not exceed 100 characters.',
  }),
  body: z.string().min(10, {
    message: 'Body must be at least 10 characters.',
  }).max(500, {
    message: 'Body must not exceed 500 characters.',
  }),
  link: z.string().url({
    message: 'Please enter a valid URL.',
  }),
})


export async function broadcastNotification(values: z.infer<typeof formSchema>) {
  try {
    const result = formSchema.safeParse(values)
    if (!result.success) {
      console.error("Validation failed:", result.error);
      return { success: false, error: result.error.errors[0].message }
    }

    const user = await getAuthUser()
    if (!user || user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    const allUserIds = (await getAllUsers()).map(u => u.token)
    const data = result.data
    const notificationObject = {
      title: data.title,
      description: data.body,
      link: data.link,
      status: "unread" as const,
    }

    await saveNotifications(allUserIds.map(token => ({
        ...notificationObject,
        user: token,
    })))

    return { success: true, error: '' }
  } catch (e) {
    console.error("Error in broadcastNotification:", e)
    return { success: false, error: (e as Error).message }
  }
}