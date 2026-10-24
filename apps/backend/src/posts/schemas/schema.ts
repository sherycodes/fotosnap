import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../../auth/schema.js';

export const post = pgTable('posts', {
  id: serial().primaryKey(),
  image: text().notNull(),
  caption: text().notNull(),
  likes: integer().notNull().default(0),
  comments: integer().notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
});

export const postRelations = relations(post, ({ one }) => ({
  user: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
}));
