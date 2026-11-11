import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from '../../auth/schema.ts';
import { comment } from '../../comments/schemas/schema.ts';

export const post = pgTable(
  'posts',
  {
    id: serial().primaryKey(),
    image: text().notNull(),
    caption: text().notNull(),
    createdAt: timestamp('created_at')
      .$defaultFn(() => new Date())
      .notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
  },
  (table) => [
    index('posts_user_id_created_at_idx').on(table.userId, table.createdAt),
  ],
);

export const postRelations = relations(post, ({ one, many }) => ({
  user: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
  likes: many(like),
  comments: many(comment),
  bookmarks: many(bookmark),
}));

export const like = pgTable(
  'likes',
  {
    id: serial().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    postId: integer('post_id')
      .notNull()
      .references(() => post.id),
  },
  (table) => [
    index('likes_post_id_user_id_idx').on(table.postId, table.userId),
  ],
);

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

export const bookmark = pgTable(
  'bookmarks',
  {
    id: serial().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    postId: integer('post_id')
      .notNull()
      .references(() => post.id),
    createdAt: timestamp('created_at')
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index('bookmarks_post_id_user_id_idx').on(table.postId, table.userId),
    index('bookmarks_user_id_created_at_idx').on(table.userId, table.createdAt),
  ],
);

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
  user: one(user, {
    fields: [bookmark.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [bookmark.postId],
    references: [post.id],
  }),
}));
