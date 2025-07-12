import { pgTable, text, integer, timestamp, json, varchar, serial, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const moderationStatusEnum = pgEnum('moderation_status', ['pending', 'approved', 'rejected']);
export const notificationStatusEnum = pgEnum('notification_status', ['unread', 'read']);
export const reportStatusEnum = pgEnum('report_status', ['pending', 'resolved']);
export const securityLogTypeEnum = pgEnum('security_log_type', ['admin_login', 'moderation_action']);
export const tokenRoleEnum = pgEnum('token_role', ['admin', 'user']);

// Posts table
export const posts = pgTable('posts', {
	id: varchar('id', { length: 255 }).primaryKey(),
	title: text('title').notNull(),
	body: text('body').notNull(),
	upvotes: integer('upvotes').default(0).notNull(),
	downvotes: integer('downvotes').default(0).notNull(),
	comment_count: integer('comment_count').default(0).notNull(),
	tags: json('tags').$type<Array<{ id: string; text: string }>>().default([]).notNull(),
	moderation_status: moderationStatusEnum('moderation_status').default('pending').notNull(),
	author: varchar('author', { length: 255 }),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Comments table
export const comments = pgTable('comments', {
	id: varchar('id', { length: 255 }).primaryKey(),
	post_id: varchar('post_id', { length: 255 }).references(() => posts.id, { onDelete: 'cascade' }).notNull(),
	body: text('body').notNull(),
	upvotes: integer('upvotes').default(0).notNull(),
	downvotes: integer('downvotes').default(0).notNull(),
	parent_id: varchar('parent_id', { length: 255 }),
	level: integer('level').default(0).notNull(),
	moderation_status: moderationStatusEnum('moderation_status').default('pending').notNull(),
	author: varchar('author', { length: 255 }),
	gif: json('gif').$type<{ src: string; alt: string; height: number; width: number }>(),
	is_accepted: integer('is_accepted').default(0).notNull(),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// OTP table
export const otp = pgTable('otp', {
	email: varchar('email', { length: 255 }).primaryKey(),
	otp: text('otp').notNull(),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Tokens table
export const tokens = pgTable('tokens', {
	token: varchar('token', { length: 255 }).primaryKey(),
	role: tokenRoleEnum('role').default('user').notNull(),
	username: varchar('username', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable('notifications', {
	id: serial('id').primaryKey(),
	user: varchar('user', { length: 255 }).notNull(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	status: notificationStatusEnum('status').default('unread').notNull(),
	link: text('link').notNull(),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Reports table
export const reports = pgTable('reports', {
	report_id: varchar('report_id', { length: 255 }).primaryKey(),
	post_id: varchar('post_id', { length: 255 }).references(() => posts.id, { onDelete: 'cascade' }).notNull(),
	comment_id: varchar('comment_id', { length: 255 }).references(() => comments.id, { onDelete: 'cascade' }),
	flag: text('flag').notNull(),
	status: reportStatusEnum('status').default('pending').notNull(),
	created_at: timestamp('created_at').defaultNow().notNull(),
	resolved_at: timestamp('resolved_at'),
});

// Security logs table
export const security_logs = pgTable('security_logs', {
	id: serial('id').primaryKey(),
	type_: securityLogTypeEnum('type_').notNull(),
	detail: text('detail').notNull(),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Relations
export const postsRelations = relations(posts, ({ many }) => ({
	comments: many(comments),
	reports: many(reports),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
	post: one(posts, {
		fields: [comments.post_id],
		references: [posts.id],
	}),
	parent: one(comments, {
		fields: [comments.parent_id],
		references: [comments.id],
		relationName: "parent_child",
	}),
	children: many(comments, {
		relationName: "parent_child",
	}),
	reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
	post: one(posts, {
		fields: [reports.post_id],
		references: [posts.id],
	}),
	comment: one(comments, {
		fields: [reports.comment_id],
		references: [comments.id],
	}),
}));

// Type exports
export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
export type OTP = typeof otp.$inferSelect;
export type InsertOTP = typeof otp.$inferInsert;
export type Token = typeof tokens.$inferSelect;
export type InsertToken = typeof tokens.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;
export type SecurityLog = typeof security_logs.$inferSelect;
export type InsertSecurityLog = typeof security_logs.$inferInsert;

// Additional types for compatibility
export type Tag = { id: string; text: string };
export type Gif = { src: string; alt: string; height: number; width: number };
export type NotificationType = Omit<Notification, 'id' | 'timestamp'>;
export type DBNotificationType = Notification;
export type DBComment = Comment;
export type DBPost = Post;
export type DBReport = Report;
