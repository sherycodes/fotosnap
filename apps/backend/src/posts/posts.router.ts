import {
  createPostSchema,
  likePostSchema,
  postSchema,
  type CreatePost,
  type LikePost,
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
import type { IAppContext } from '../app-context.interface.js';
import { AuthMiddleware } from '../auth/auth-trpc.middleware.js';
import { PostsService } from './posts.service.js';

@Router()
@UseMiddlewares(AuthMiddleware)
export class PostsRouter {
  constructor(private readonly postsService: PostsService) {}

  @Mutation({ input: createPostSchema })
  async create(
    @Input() createPostInput: CreatePost,
    @Ctx() context: IAppContext,
  ) {
    return this.postsService.create(createPostInput, context.user.id);
  }

  @Query({ output: z.array(postSchema) })
  async findAll(@Ctx() context: IAppContext) {
    return this.postsService.findAll(context.user.id);
  }

  @Mutation({ input: likePostSchema })
  async likePost(
    @Input() likePostInput: LikePost,
    @Ctx() context: IAppContext,
  ) {
    return this.postsService.likePost(likePostInput.postId, context.user.id);
  }
}
