import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.ts';
import { UsersRouter } from './users.router.ts';
import { UsersService } from './users.service.ts';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, UsersRouter],
  exports: [UsersService],
})
export class UsersModule {}
