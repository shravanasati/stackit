import type { DBComment, Gif } from "@/lib/models";
import { db } from "./app";
import { comments, posts } from "./schema";
import { generateCommentID } from "../utils";
import { eq, and, ne, sql } from "drizzle-orm";

export async function addComment(userToken: string, postID: string, commentBody: string, level: number, parentID: string | null, gif?: Gif) {
  try {
    const commentID = generateCommentID()
    const comment = {
      id: commentID,
      post_id: postID,
      body: commentBody,
      level: level,
      upvotes: 0,
      downvotes: 0,
      parent_id: parentID,
      moderation_status: "pending" as const,
      author: userToken,
      gif: gif || null,
    };

    return await db.transaction(async (tx) => {
      // Insert comment
      const [insertedComment] = await tx.insert(comments).values(comment).returning();

      // Update post comment count
      await tx.update(posts)
        .set({ comment_count: sql`${posts.comment_count} + 1` })
        .where(eq(posts.id, postID));

      return insertedComment;
    });
  } catch (e) {
    console.error("error in adding comment", e)
  }
}

export async function getPostComments(postID: string) {
  const postComments = await db.select()
    .from(comments)
    .where(and(
      eq(comments.post_id, postID),
      ne(comments.moderation_status, "rejected")
    ));

  return postComments;
}

async function voteComment(postID: string, commentID: string, undo: boolean, field: "upvotes" | "downvotes") {
  try {
    const increment = undo ? -1 : 1;
    await db.update(comments)
      .set({
        [field]: sql`${comments[field]} + ${increment}`
      })
      .where(and(
        eq(comments.id, commentID),
        eq(comments.post_id, postID)
      ));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function upvoteComment(postID: string, commentID: string, undo: boolean) {
  return await voteComment(postID, commentID, undo, "upvotes")
}

export async function downvoteComment(postID: string, commentID: string, undo: boolean) {
  return await voteComment(postID, commentID, undo, "downvotes")
}

export async function updateCommentModerationStatus(postID: string, commentID: string, newStatus: "approved" | "rejected") {
  try {
    return await db.transaction(async (tx) => {
      // Update comment moderation status
      await tx.update(comments)
        .set({ moderation_status: newStatus })
        .where(and(
          eq(comments.id, commentID),
          eq(comments.post_id, postID)
        ));

      // If rejected, decrement post comment count
      if (newStatus === "rejected") {
        await tx.update(posts)
          .set({ comment_count: sql`${posts.comment_count} - 1` })
          .where(eq(posts.id, postID));
      }
    });
    return true;
  } catch (e) {
    console.error("error in update comment moderation status", e);
    return false;
  }
}

export async function getParentComments(postID: string, parentID: string | null) {
  const authors: DBComment[] = [];
  let currentCommentID = parentID;

  while (currentCommentID) {
    const [comment] = await db.select()
      .from(comments)
      .where(and(
        eq(comments.id, currentCommentID),
        eq(comments.post_id, postID)
      ))
      .limit(1);

    if (comment?.author) {
      // only include comments that have an author
      authors.push(comment);
    }
    currentCommentID = comment?.parent_id || null;
  }

  return authors;
}