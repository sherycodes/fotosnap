import { Inject, Injectable } from '@nestjs/common';
import type { CreateStoryInput, StoryGroup } from '@repo/trpc/schemas';
import { and, eq, gt, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { follow } from '../auth/schema.ts';
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

  async getStories(userId: string): Promise<StoryGroup[]> {
    const followingIds = await this.db
      .select({ id: follow.followingId })
      .from(follow)
      .where(eq(follow.followerId, userId));

    const userIds = [userId, ...followingIds.map((following) => following.id)];

    const stories = await this.db.query.story.findMany({
      where: and(
        gt(story.expiresAt, new Date()),
        inArray(story.userId, userIds),
      ),
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
