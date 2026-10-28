import { Inject, Injectable } from '@nestjs/common';
import type { CreatePost, Post } from '@repo/trpc/schemas';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { follow } from '../auth/schema.ts';
import { DATABASE_CONNECTION } from '../database/database-connection.ts';
import { schema } from '../database/database.module.ts';
import { bookmark, like, post } from './schemas/schema.ts';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  private async getFollowedUserIds(userId: string) {
    const following = await this.db
      .select({ id: follow.followingId })
      .from(follow)
      .where(eq(follow.followerId, userId));
    return [userId, ...following.map((f) => f.id)];
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
    const posts = await this.db.query.post.findMany({
      with: {
        user: true,
        likes: true,
        comments: true,
        bookmarks: true,
      },
      where: postUserId
        ? eq(post.userId, postUserId)
        : inArray(post.userId, await this.getFollowedUserIds(userId)),
      orderBy: [desc(post.createdAt)],
    });

    return posts.map((savedPost) => ({
      id: savedPost.id,
      user: {
        id: savedPost.user.id,
        username: savedPost.user.name,
        avatar: savedPost.user.image || '',
      },
      image: savedPost.image,
      likes: savedPost.likes.length,
      caption: savedPost.caption,
      createdAt: savedPost.createdAt.toISOString(),
      comments: savedPost.comments.length,
      isLiked: savedPost.likes.some((like) => like.userId === userId),
      isSaved: savedPost.bookmarks.some(
        (bookmark) => bookmark.userId === userId,
      ),
    }));
  }

  async getBookmarks(userId: string): Promise<Post[]> {
    const bookmarks = await this.db.query.bookmark.findMany({
      with: {
        post: {
          with: {
            user: true,
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
      where: eq(bookmark.userId, userId),
      orderBy: [desc(bookmark.createdAt)],
    });

    const posts = bookmarks.map((bookmark) => bookmark.post);

    return posts.map((savedPost) => ({
      id: savedPost.id,
      user: {
        id: savedPost.user.id,
        username: savedPost.user.name,
        avatar: savedPost.user.image || '',
      },
      image: savedPost.image,
      likes: savedPost.likes.length,
      caption: savedPost.caption,
      createdAt: savedPost.createdAt.toISOString(),
      comments: savedPost.comments.length,
      isLiked: savedPost.likes.some((like) => like.userId === userId),
      isSaved: true,
    }));
  }
}
