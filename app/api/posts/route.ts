import { updateTokenLifetime } from "@/lib/database/firestore"
import { getPostsFeed } from "@/lib/database/posts"
import { getAuthUser } from "@/lib/user"
import { TOKEN_EXPIRY_DURATION } from "@/lib/utils"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export const revalidate = 60
export const dynamic = "force-dynamic"

const querySchema = z.strictObject({
  orderByField: z.enum(["upvotes", "comment_count", "downvotes", "timestamp"]),
  lastDocID: z.string().optional().nullable(),
  limitTo: z.number().min(1).max(10),
})

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dataEntries = Array.from(request.nextUrl.searchParams.entries()).map(([key, value]) => {
      if (key === "limitTo") {
        return [key, parseInt(value)];
      }
      return [key, value];
    });

    const data = Object.fromEntries(dataEntries);
    const result = querySchema.safeParse(data)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request body: " + result.error.flatten().fieldErrors }, { status: 400 })
    }

    const { orderByField, lastDocID, limitTo } = result.data
    const posts = await getPostsFeed(orderByField, lastDocID, limitTo)

    const session = cookies().get("session")
    if (session) {
      // refresh user token
      const now = new Date()
      updateTokenLifetime(user.token!, now)

      cookies().set("session", session.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: TOKEN_EXPIRY_DURATION, // 2 weeks
        domain: process.env.NODE_ENV === "production" ? "stackit.tech" : undefined,
      })
    }

    cookies().set("orderByField", orderByField, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      domain: process.env.NODE_ENV === "production" ? "stackit.tech" : undefined,
    })


    return NextResponse.json(posts, {
      headers: {
        "Cache-Control": `max-age=${60 * 5}, stale-while-revalidate=${60}`,
      }
    })

  }

  catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "An internal server occured, try again later." }, { status: 500 })
  }
}
