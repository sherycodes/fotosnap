import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as authSchema from '../auth/schema.ts';
import * as commentSchema from '../comments/schemas/schema.ts';
import * as postSchema from '../posts/schemas/schema.ts';
import * as storySchema from '../stories/schemas/schema.ts';
import { DATABASE_CONNECTION } from './database-connection.ts';

export const schema = {
  ...authSchema,
  ...postSchema,
  ...commentSchema,
  ...storySchema,
};

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
        });
        return drizzle(pool, {
          schema,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
