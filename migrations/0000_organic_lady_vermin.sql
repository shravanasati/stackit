CREATE TYPE "public"."moderation_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('unread', 'read');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('pending', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."security_log_type" AS ENUM('admin_login', 'moderation_action');--> statement-breakpoint
CREATE TYPE "public"."token_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"post_id" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"downvotes" integer DEFAULT 0 NOT NULL,
	"parent_id" varchar(255),
	"level" integer DEFAULT 0 NOT NULL,
	"moderation_status" "moderation_status" DEFAULT 'pending' NOT NULL,
	"author" varchar(255),
	"gif" json,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" "notification_status" DEFAULT 'unread' NOT NULL,
	"link" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "otp" (
	"email" varchar(255) PRIMARY KEY NOT NULL,
	"otp" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"downvotes" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"tags" json DEFAULT '[]'::json NOT NULL,
	"moderation_status" "moderation_status" DEFAULT 'pending' NOT NULL,
	"author" varchar(255),
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"report_id" varchar(255) PRIMARY KEY NOT NULL,
	"post_id" varchar(255) NOT NULL,
	"comment_id" varchar(255),
	"flag" text NOT NULL,
	"status" "report_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "security_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"type_" "security_log_type" NOT NULL,
	"detail" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"token" varchar(255) PRIMARY KEY NOT NULL,
	"role" "token_role" DEFAULT 'user' NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;