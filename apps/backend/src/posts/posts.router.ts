import { Ctx, Input, Mutation, Query, Router } from 'nestjs-trpc-v2';
import z from 'zod';
import type { IAppContext } from '../app-context.interface.js';
import { PostsService } from './posts.service.js';
import {
  createPostSchema,
  postSchema,
  type CreatePost,
} from './schemas/trpc.schema.js';

@Router()
export class PostsRouter {
  constructor(private readonly postsService: PostsService) {}

  @Mutation({ input: createPostSchema, output: postSchema })
  async create(
    @Input() createPostInput: CreatePost,
    @Ctx() context: IAppContext,
  ) {
    return this.postsService.create(createPostInput, context.user.id);
  }

  @Query({ output: z.array(postSchema) })
  async findAll() {
    return this.postsService.findAll();
  }
}
