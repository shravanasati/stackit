import type { Post as DrizzlePost, Comment as DrizzleComment, Tag, Gif } from "@/lib/database/schema";

export type Post = DrizzlePost;
export type DBPost = DrizzlePost;
export type Comment = DrizzleComment;
export type DBComment = DrizzleComment;

export type { Tag, Gif };