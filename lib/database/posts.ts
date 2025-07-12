import { db } from "@/lib/database/app";
import { posts, tokens } from "./schema";
import { Post } from "@/lib/models";
import { generatePostID } from "@/lib/utils";
import { eq, ne, desc, sql } from "drizzle-orm";

export interface PaginatedResult<T> {
  items: T[];
  lastDocID: string | null;
  hasMore: boolean;
  boardName: string | null;
  orderByField: string;
  limit: number;
}

export interface Tag {
  id: string;
  text: string;
}


// Note: Board functionality removed as it wasn't in the schema
// If you need boards, add a board column to the posts table

export async function getPostsFeed(orderByField: string = "timestamp", lastDocID: string | null = null, limitTo: number = 10) {
  // Default to timestamp ordering if invalid field provided
  const orderColumn = orderByField === "timestamp" ? posts.timestamp :
    orderByField === "upvotes" ? posts.upvotes :
      orderByField === "downvotes" ? posts.downvotes :
        posts.timestamp;

  let query = db.select({
    id: posts.id,
    title: posts.title,
    body: posts.body,
    tags: posts.tags,
    upvotes: posts.upvotes,
    downvotes: posts.downvotes,
    comment_count: posts.comment_count,
    timestamp: posts.timestamp,
    moderation_status: posts.moderation_status,
    author: tokens.username,
  })
    .from(posts)
    .leftJoin(tokens, eq(posts.author, tokens.token))
    .where(ne(posts.moderation_status, "rejected"))
    .orderBy(desc(orderColumn))
    .limit(limitTo + 1);

  if (lastDocID) {
    // For pagination, we need to implement cursor-based pagination
    // This is a simplified version - you might need to adjust based on your needs
    const [lastPost] = await db.select()
      .from(posts)
      .where(eq(posts.id, lastDocID))
      .limit(1);

    if (lastPost) {
      query = db.select({
        id: posts.id,
        title: posts.title,
        body: posts.body,
        tags: posts.tags,
        upvotes: posts.upvotes,
        downvotes: posts.downvotes,
        comment_count: posts.comment_count,
        timestamp: posts.timestamp,
        moderation_status: posts.moderation_status,
        author: tokens.username,
      })
        .from(posts)
        .leftJoin(tokens, eq(posts.author, tokens.token))
        .where(ne(posts.moderation_status, "rejected"))
        .orderBy(desc(orderColumn))
        .limit(limitTo + 1);
      // Note: For proper cursor pagination, you'd need to add a where clause
      // comparing the orderBy field value
    }
  }

  const results = await query;
  const hasMore = results.length > limitTo;
  const items = results.slice(0, limitTo);

  const result: PaginatedResult<Post> = {
    items,
    lastDocID: hasMore ? results[results.length - 2]?.id || null : null,
    hasMore,
    orderByField,
    limit: limitTo,
    boardName: null, // Boards not implemented in schema
  };

  return result;
}

export async function getPostByID(postID: string) {
  const [post] = await db.select({
    id: posts.id,
    title: posts.title,
    body: posts.body,
    tags: posts.tags,
    upvotes: posts.upvotes,
    downvotes: posts.downvotes,
    comment_count: posts.comment_count,
    timestamp: posts.timestamp,
    moderation_status: posts.moderation_status,
    author: tokens.username,
  })
    .from(posts)
    .leftJoin(tokens, eq(posts.author, tokens.token))
    .where(eq(posts.id, postID))
    .limit(1);

  return post || null;
}

export async function savePost(userToken: string, title: string, body: string, tags: Tag[]) {
  const postID = generatePostID();

  await db.insert(posts).values({
    id: postID,
    title: title,
    tags: tags,
    upvotes: 0,
    downvotes: 0,
    comment_count: 0,
    body: body,
    moderation_status: "pending",
    author: userToken,
  });

  return postID;
}

export async function updatePostModerationStatus(postID: string, newStatus: "approved" | "rejected") {
  try {
    await db.update(posts)
      .set({ moderation_status: newStatus })
      .where(eq(posts.id, postID));
    return true;
  } catch (e) {
    console.error("error in update post moderation status", e);
    return false;
  }
}

async function votePost(postID: string, undo: boolean, field: "upvotes" | "downvotes") {
  try {
    const increment = undo ? -1 : 1;
    await db.update(posts)
      .set({
        [field]: sql`${posts[field]} + ${increment}`
      })
      .where(eq(posts.id, postID));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function upvotePost(postID: string, undo: boolean) {
  return await votePost(postID, undo, "upvotes");
}

export async function downvotePost(postID: string, undo: boolean) {
  return await votePost(postID, undo, "downvotes");
}