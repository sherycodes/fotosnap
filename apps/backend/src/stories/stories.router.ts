import {
  type CreateStoryInput,
  createStorySchema,
  storyGroupSchema,
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
import { StoriesService } from './stories.service.ts';

@Router()
@UseMiddlewares(AuthMiddleware)
export class StoriesRouter {
  constructor(private readonly storiesService: StoriesService) {}

  @Mutation({ input: createStorySchema })
  async create(
    @Input() createStoryInput: CreateStoryInput,
    @Ctx() ctx: IAppContext,
  ) {
    return this.storiesService.create(createStoryInput, ctx.user.id);
  }

  @Query({ output: z.array(storyGroupSchema) })
  async getStories() {
    return this.storiesService.getStories();
  }
}
