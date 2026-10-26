import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { UsersRouter } from './users.router.ts';
import { UsersService } from './users.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, UsersRouter],
  exports: [UsersService],
})
export class UsersModule {}
