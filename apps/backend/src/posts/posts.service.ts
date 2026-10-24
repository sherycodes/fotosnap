import { Inject, Injectable } from '@nestjs/common';
import { desc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UsersService } from '../auth/users/users.service.js';
import { DATABASE_CONNECTION } from '../database/database-connection.js';
import { schema } from '../database/database.module.js';
import { post } from './schemas/schema.js';
import type { CreatePost, Post } from './schemas/trpc.schema.js';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPostInput: CreatePost, userId: string) {
    const [newPost] = await this.db
      .insert(post)
      .values({
        userId,
        caption: createPostInput.caption,
        likes: 0,
        comments: 0,
        image: '',
      })
      .returning();

    return this.formatPostResponse(newPost, userId);
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.db.query.post.findMany({
      with: {
        user: true,
      },
      orderBy: [desc(post.createdAt)],
    });
    const formattedPosts = await Promise.all(
      posts.map((post) => this.formatPostResponse(post, post.userId)),
    );
    return formattedPosts;
  }

  private async formatPostResponse(
    savedPost: typeof post.$inferInsert,
    userId: string,
  ) {
    const userInfo = await this.usersService.findById(userId);

    return {
      id: savedPost.id!,
      user: {
        username: userInfo.name,
        avatar: '',
      },
      image: savedPost.image,
      caption: savedPost.caption,
      likes: savedPost.likes ?? 0,
      createdAt: savedPost.createdAt!.toISOString(),
      comments: 0,
    };
  }
}
