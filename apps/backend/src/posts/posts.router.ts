import { Input, Mutation, Query, Router } from 'nestjs-trpc-v2';
import z from 'zod';
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
  async create(@Input() createPostInput: CreatePost) {
    return this.postsService.create(
      createPostInput,
      'zw8fbTEnJBxwFBKaKuxGYniC7BwM5UIg',
    );
  }

  @Query({ output: z.array(postSchema) })
  async findAll() {
    return this.postsService.findAll();
  }
}
