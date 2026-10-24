import { Module } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { PostsRouter } from './posts.router.js';
import { DatabaseModule } from '../database/database.module.js';
import { UsersModule } from '../auth/users/users.module.js';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [PostsService, PostsRouter],
})
export class PostsModule {}
