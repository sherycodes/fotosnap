import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../../auth/schema.ts';

export const story = pgTable('stories', {
  id: serial().primaryKey(),
  image: text().notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp('expires_at').notNull(),
});

export const storyRelations = relations(story, ({ one }) => ({
  user: one(user, {
    fields: [story.userId],
    references: [user.id],
  }),
}));
