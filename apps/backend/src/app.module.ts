import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { TRPCModule } from 'nestjs-trpc-v2';
import { AppContext } from './app.context.ts';
import { AppController } from './app.controller.ts';
import { AuthMiddleware } from './auth/auth-trpc.middleware.ts';
import { UsersModule } from './auth/users/users.module.ts';
import { CommentsModule } from './comments/comments.module.ts';
import { DATABASE_CONNECTION } from './database/database-connection.ts';
import { DatabaseModule } from './database/database.module.ts';
import { PostsModule } from './posts/posts.module.ts';
import { StoriesModule } from './stories/stories.module.ts';
import { UploadModule } from './upload/upload.module.ts';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    TRPCModule.forRoot({
      autoSchemaFile:
        process.env.NODE_ENV !== 'production'
          ? '../../packages/trpc/src/server'
          : undefined,
      basePath: '/api/trpc',
      context: AppContext,
    }),
    AuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule],
      useFactory: (db: NodePgDatabase, configService: ConfigService) => ({
        auth: betterAuth({
          database: drizzleAdapter(db, { provider: 'pg' }),
          emailAndPassword: { enabled: true },
          trustedOrigins: configService.get('UI_URL')
            ? [configService.get('UI_URL')!]
            : undefined,
        }),
      }),
      inject: [DATABASE_CONNECTION, ConfigService],
    }),
    PostsModule,
    UsersModule,
    UploadModule,
    CommentsModule,
    StoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AuthMiddleware,
    AppContext,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
