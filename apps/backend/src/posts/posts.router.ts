import {
  bookmarkPostSchema,
  createPostSchema,
  findAllPostsSchema,
  likePostSchema,
  postSchema,
  type BookmarkPost,
  type CreatePost,
  type FindAllPostsInput,
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
import type { IAppContext } from '../app-context.interface.ts';
import { AuthMiddleware } from '../auth/auth-trpc.middleware.ts';
import { PostsService } from './posts.service.ts';

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

  @Query({ input: findAllPostsSchema, output: z.array(postSchema) })
  async findAll(
    @Ctx() context: IAppContext,
    @Input() findAllPostsInput: FindAllPostsInput,
  ) {
    return this.postsService.findAll(
      context.user.id,
      findAllPostsInput?.userId,
    );
  }

  @Mutation({ input: likePostSchema })
  async likePost(
    @Input() likePostInput: LikePost,
    @Ctx() context: IAppContext,
  ) {
    return this.postsService.likePost(likePostInput.postId, context.user.id);
  }

  @Mutation({ input: bookmarkPostSchema })
  async bookmarkPost(
    @Input() bookmarkPostInput: BookmarkPost,
    @Ctx() context: IAppContext,
  ) {
    return this.postsService.bookmarkPost(
      bookmarkPostInput.postId,
      context.user.id,
    );
  }

  @Query({ output: z.array(postSchema) })
  async getBookmarks(@Ctx() context: IAppContext) {
    return this.postsService.getBookmarks(context.user.id);
  }
}
