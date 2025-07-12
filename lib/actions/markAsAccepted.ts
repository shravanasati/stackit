'use server'

import { z } from "zod"
import { getAuthUser } from "@/lib/user"
import { eq, and } from "drizzle-orm"
import { db } from "@/lib/database/app"
import { comments, posts } from "@/lib/database/schema"

const markAsAcceptedSchema = z.strictObject({
	commentID: z.string().min(1, "Invalid comment ID"),
	postID: z.string().min(6, "Invalid post ID").max(6, "Invalid post ID"),
})

export async function markAsAccepted(values: z.infer<typeof markAsAcceptedSchema>) {
	const user = await getAuthUser()
	if (!user) {
		return {
			success: false,
			errors: {
				server: "You must be logged in to mark comments as accepted"
			}
		}
	}

	const result = markAsAcceptedSchema.safeParse(values)

	if (!result.success) {
		return {
			success: false,
			errors: result.error.flatten().fieldErrors
		}
	}

	const { commentID, postID } = result.data

	try {
		// First verify that the user owns the post
		const post = await db.select().from(posts).where(eq(posts.id, postID)).limit(1)

		if (!post.length || post[0].author !== user.token) {
			return {
				success: false,
				errors: {
					server: "You can only mark comments as accepted on your own posts"
				}
			}
		}

		// Check if the comment exists and belongs to the post
		const comment = await db.select()
			.from(comments)
			.where(and(eq(comments.id, commentID), eq(comments.post_id, postID)))
			.limit(1)

		if (!comment.length) {
			return {
				success: false,
				errors: {
					server: "Comment not found"
				}
			}
		}

		// First, unmark any previously accepted comments for this post
		await db.update(comments)
			.set({ is_accepted: 0 })
			.where(eq(comments.post_id, postID))

		// Mark the specified comment as accepted
		await db.update(comments)
			.set({ is_accepted: 1 })
			.where(eq(comments.id, commentID))

		return { success: true }
	} catch (e) {
		console.error(e)
		return {
			success: false,
			errors: {
				server: "An error occurred. Please try again later."
			}
		}
	}
}
