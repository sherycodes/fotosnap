import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.ts';
import { StoriesRouter } from './stories.router.ts';
import { StoriesService } from './stories.service.ts';

@Module({
  imports: [DatabaseModule],
  providers: [StoriesService, StoriesRouter],
})
export class StoriesModule {}
