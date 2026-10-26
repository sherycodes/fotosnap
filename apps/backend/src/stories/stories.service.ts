import { Inject, Injectable } from '@nestjs/common';
import type { CreateStoryInput, StoryGroup } from '@repo/trpc/schemas';
import { gt } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection.ts';
import { schema } from '../database/database.module.ts';
import { story } from './schemas/schema.ts';

@Injectable()
export class StoriesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createStoryInput: CreateStoryInput, userId: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    const [newStory] = await this.db
      .insert(story)
      .values({
        userId,
        image: createStoryInput.image,
        expiresAt,
      })
      .returning();
    return newStory;
  }

  async getStories(): Promise<StoryGroup[]> {
    const stories = await this.db.query.story.findMany({
      where: gt(story.expiresAt, new Date()),
      with: {
        user: true,
      },
    });

    const storyGroups = new Map<string, StoryGroup>();

    for (const story of stories) {
      if (!storyGroups.has(story.userId)) {
        storyGroups.set(story.userId, {
          userId: story.userId,
          username: story.user.name,
          avatar: story.user.image || '',
          stories: [],
        });
      }

      const group = storyGroups.get(story.userId);
      group?.stories.push({
        id: story.id,
        user: {
          id: story.user.id,
          username: story.user.name,
          avatar: story.user.image || '',
        },
        image: story.image,
        createdAt: story.createdAt.toISOString(),
        expiresAt: story.expiresAt.toISOString(),
      });
    }

    return Array.from(storyGroups.values());
  }
}
