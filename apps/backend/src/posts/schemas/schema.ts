import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../../auth/schema.js';

export const post = pgTable('posts', {
  id: serial().primaryKey(),
  image: text().notNull(),
  caption: text().notNull(),
  comments: integer().notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
});

export const postRelations = relations(post, ({ one, many }) => ({
  user: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
  likes: many(like),
}));

export const like = pgTable('likes', {
  id: serial().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  postId: integer('post_id')
    .notNull()
    .references(() => post.id),
});

export const likeRelations = relations(like, ({ one }) => ({
  user: one(user, {
    fields: [like.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [like.postId],
    references: [post.id],
  }),
}));
