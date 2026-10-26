import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentInput } from '@repo/trpc/schemas';
import { TRPCError } from '@trpc/server';
import { and, asc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection.ts';
import { schema } from '../database/database.module.ts';
import { comment } from './schemas/schema.ts';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createCommentInput: CreateCommentInput, userId: string) {
    const [newComment] = await this.db
      .insert(comment)
      .values({
        text: createCommentInput.text,
        postId: createCommentInput.postId,
        userId,
      })
      .returning({ id: comment.id, postId: comment.postId });

    return newComment;
  }

  async delete(commentId: number, userId: string) {
    const [deletedComment] = await this.db
      .delete(comment)
      .where(and(eq(comment.id, commentId), eq(comment.userId, userId)))
      .returning({ id: comment.id, postId: comment.postId });

    if (!deletedComment) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Comment not found',
      });
    }

    return deletedComment;
  }

  async findByPostId(postId: number) {
    const comments = await this.db.query.comment.findMany({
      where: eq(comment.postId, postId),
      with: {
        user: true,
      },
      orderBy: [asc(comment.createdAt)],
    });

    return comments.map((comment) => ({
      id: comment.id,
      user: {
        id: comment.user.id,
        username: comment.user.name,
        avatar: comment.user.image || '',
      },
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
    }));
  }
}
