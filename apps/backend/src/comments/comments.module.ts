import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import { DatabaseModule } from '../database/database.module.ts';
import { CommentsRouter } from './comments.router.ts';

@Module({
  imports: [DatabaseModule],
  providers: [CommentsService, CommentsRouter],
})
export class CommentsModule {}
