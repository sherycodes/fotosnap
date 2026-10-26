import { Module } from '@nestjs/common';
import { PostsService } from './posts.service.ts';
import { PostsRouter } from './posts.router.ts';
import { DatabaseModule } from '../database/database.module.ts';
import { UsersModule } from '../auth/users/users.module.ts';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [PostsService, PostsRouter],
})
export class PostsModule {}
