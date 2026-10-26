import {
  type UpdateProfileInput,
  updateProfileSchema,
  type UserIdInput,
  userIdSchema,
  userProfileSchema,
  userSchema,
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
import type { IAppContext } from '../../app-context.interface.ts';
import { AuthMiddleware } from '../auth-trpc.middleware.ts';
import { UsersService } from './users.service.ts';

@Router()
@UseMiddlewares(AuthMiddleware)
export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}

  @Mutation({ input: userIdSchema })
  async follow(@Input() input: UserIdInput, @Ctx() ctx: IAppContext) {
    return this.usersService.follow(ctx.user.id, input.userId);
  }

  @Mutation({ input: userIdSchema })
  async unfollow(@Input() input: UserIdInput, @Ctx() ctx: IAppContext) {
    return this.usersService.unfollow(ctx.user.id, input.userId);
  }

  @Query({ input: userIdSchema, output: z.array(userSchema) })
  async getFollowers(@Input() input: UserIdInput) {
    return this.usersService.getFollowers(input.userId);
  }

  @Query({ input: userIdSchema, output: z.array(userSchema) })
  async getFollowing(@Input() input: UserIdInput) {
    return this.usersService.getFollowing(input.userId);
  }

  @Query({ output: z.array(userSchema) })
  async getSuggestedUsers(@Ctx() ctx: IAppContext) {
    return this.usersService.getSuggestedUsers(ctx.user.id);
  }

  @Mutation({ input: updateProfileSchema })
  async updateProfile(
    @Input() input: UpdateProfileInput,
    @Ctx() ctx: IAppContext,
  ) {
    return this.usersService.updateProfile(ctx.user.id, input);
  }

  @Query({ input: userIdSchema, output: userProfileSchema })
  async getUserProfile(@Input() input: UserIdInput, @Ctx() ctx: IAppContext) {
    return this.usersService.getUserProfile(input.userId, ctx.user.id);
  }
}
