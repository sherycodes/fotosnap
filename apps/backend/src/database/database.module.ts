import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as fs from 'node:fs';
import * as path from 'node:path';
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
      useFactory: async (configService: ConfigService) => {
        let certificate: string | undefined;
        if (process.env.NODE_ENV === 'production') {
          const certPath = path.resolve('global-bundle.pem');
          certificate = fs.readFileSync(certPath).toString();
        }
        const pool = new Pool({
          host: configService.getOrThrow('DATABASE_HOST'),
          port: parseInt(configService.getOrThrow('DATABASE_PORT')),
          user: configService.getOrThrow('DATABASE_USER'),
          password: configService.getOrThrow('DATABASE_PASSWORD'),
          database: configService.getOrThrow('DATABASE_NAME'),
          ssl: certificate
            ? { ca: certificate, rejectUnauthorized: true }
            : false,
        });
        const db = drizzle(pool, {
          schema,
        });
        if (process.env.NODE_ENV === 'production') {
          // Apply pending migrations before the app starts serving requests
          await migrate(db, { migrationsFolder: path.resolve('drizzle') });
        }
        return db;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
