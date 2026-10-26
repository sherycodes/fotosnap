import { Inject, Injectable } from '@nestjs/common';
import type { CreatePost, Post } from '@repo/trpc/schemas';
import { and, desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection.ts';
import { schema } from '../database/database.module.ts';
import { like, post } from './schemas/schema.ts';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

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

  async findAll(userId: string): Promise<Post[]> {
    const posts = await this.db.query.post.findMany({
      with: {
        user: true,
        likes: true,
        comments: true,
      },
      orderBy: [desc(post.createdAt)],
    });

    return posts.map((savedPost) => ({
      id: savedPost.id,
      user: {
        username: savedPost.user.name,
        avatar: savedPost.user.image || '',
      },
      image: savedPost.image,
      likes: savedPost.likes.length,
      caption: savedPost.caption,
      createdAt: savedPost.createdAt.toISOString(),
      comments: savedPost.comments.length,
      isLiked: savedPost.likes.some((like) => like.userId === userId),
    }));
  }
}
