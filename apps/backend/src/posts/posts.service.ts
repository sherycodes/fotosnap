import { Inject, Injectable } from '@nestjs/common';
import type { CreatePost, Post } from '@repo/trpc/schemas';
import { and, desc, eq, inArray, or, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { follow, user } from '../auth/schema.ts';
import { comment } from '../comments/schemas/schema.ts';
import { DATABASE_CONNECTION } from '../database/database-connection.ts';
import { schema } from '../database/database.module.ts';
import { bookmark, like, post } from './schemas/schema.ts';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  private postFields(userId: string) {
    return {
      id: post.id,
      image: post.image,
      caption: post.caption,
      createdAt: post.createdAt,
      userId: user.id,
      username: user.name,
      avatar: user.image,
      likes:
        sql<number>`(select count(*) from ${like} where ${like.postId} = ${post.id})`.mapWith(
          Number,
        ),
      comments:
        sql<number>`(select count(*) from ${comment} where ${comment.postId} = ${post.id})`.mapWith(
          Number,
        ),
      isLiked: sql<boolean>`exists(select 1 from ${like} where ${like.postId} = ${post.id} and ${like.userId} = ${userId})`,
      isSaved: sql<boolean>`exists(select 1 from ${bookmark} where ${bookmark.postId} = ${post.id} and ${bookmark.userId} = ${userId})`,
    };
  }

  private toPost(row: {
    id: number;
    image: string;
    caption: string;
    createdAt: Date;
    userId: string;
    username: string;
    avatar: string | null;
    likes: number;
    comments: number;
    isLiked: boolean;
    isSaved: boolean;
  }): Post {
    return {
      id: row.id,
      user: {
        id: row.userId,
        username: row.username,
        avatar: row.avatar || '',
      },
      image: row.image,
      caption: row.caption,
      likes: row.likes,
      comments: row.comments,
      createdAt: row.createdAt.toISOString(),
      isLiked: row.isLiked,
      isSaved: row.isSaved,
    };
  }

  async create(createPostInput: CreatePost, userId: string) {
    await this.db
      .insert(post)
      .values({
        userId,
        caption: createPostInput.caption,
        image: createPostInput.image,
      })
      .returning();
  }

  async likePost(postId: number, userId: string) {
    const existingLike = await this.db.query.like.findFirst({
      where: and(eq(like.userId, userId), eq(like.postId, postId)),
    });

    if (existingLike) {
      await this.db.delete(like).where(eq(like.id, existingLike.id));
    } else {
      await this.db.insert(like).values({
        postId,
        userId,
      });
    }
  }

  async bookmarkPost(postId: number, userId: string) {
    const existingBookmark = await this.db.query.bookmark.findFirst({
      where: and(eq(bookmark.userId, userId), eq(bookmark.postId, postId)),
    });

    if (existingBookmark) {
      await this.db
        .delete(bookmark)
        .where(eq(bookmark.id, existingBookmark.id));
    } else {
      await this.db.insert(bookmark).values({
        postId,
        userId,
      });
    }
  }

  async findAll(userId: string, postUserId?: string): Promise<Post[]> {
    const followed = this.db
      .select({ id: follow.followingId })
      .from(follow)
      .where(eq(follow.followerId, userId));

    const rows = await this.db
      .select(this.postFields(userId))
      .from(post)
      .innerJoin(user, eq(post.userId, user.id))
      .where(
        postUserId
          ? eq(post.userId, postUserId)
          : or(eq(post.userId, userId), inArray(post.userId, followed)),
      )
      .orderBy(desc(post.createdAt));

    return rows.map((row) => this.toPost(row));
  }

  async getBookmarks(userId: string): Promise<Post[]> {
    const rows = await this.db
      .select(this.postFields(userId))
      .from(bookmark)
      .innerJoin(post, eq(bookmark.postId, post.id))
      .innerJoin(user, eq(post.userId, user.id))
      .where(eq(bookmark.userId, userId))
      .orderBy(desc(bookmark.createdAt));

    return rows.map((row) => this.toPost(row));
  }
}
