import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { TRPCModule } from 'nestjs-trpc-v2';
import { AppContext } from './app.context.js';
import { AppController } from './app.controller.js';
import { AuthMiddleware } from './auth/auth-trpc.middleware.js';
import { UsersModule } from './auth/users/users.module.js';
import { DATABASE_CONNECTION } from './database/database-connection.js';
import { DatabaseModule } from './database/database.module.js';
import { PostsModule } from './posts/posts.module.js';
import { UploadModule } from './upload/upload.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    TRPCModule.forRoot({
      autoSchemaFile: '../../packages/trpc/src/server',
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
