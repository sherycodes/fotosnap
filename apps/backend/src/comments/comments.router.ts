import {
  commentSchema,
  type CreateCommentInput,
  createCommentSchema,
  type DeleteCommentInput,
  deleteCommentSchema,
  type GetCommentsInput,
  getCommentsSchema,
} from '@repo/trpc/schemas';
import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import z from 'zod';
import type { IAppContext } from '../app-context.interface.ts';
import { AuthMiddleware } from '../auth/auth-trpc.middleware.ts';
import { CommentsService } from './comments.service.ts';

@Router()
@UseMiddlewares(AuthMiddleware)
export class CommentsRouter {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation({ input: createCommentSchema })
  async create(
    @Input() createCommentInput: CreateCommentInput,
    @Ctx() context: IAppContext,
  ) {
    return this.commentsService.create(createCommentInput, context.user.id);
  }

  @Mutation({ input: deleteCommentSchema })
  async delete(
    @Input() deleteCommentInput: DeleteCommentInput,
    @Ctx() context: IAppContext,
  ) {
    return this.commentsService.delete(
      deleteCommentInput.commentId,
      context.user.id,
    );
  }

  @Query({ input: getCommentsSchema, output: z.array(commentSchema) })
  async findByPostId(@Input() getCommentsInput: GetCommentsInput) {
    return this.commentsService.findByPostId(getCommentsInput.postId);
  }
}
