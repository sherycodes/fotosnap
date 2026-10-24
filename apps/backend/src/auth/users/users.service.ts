import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../database/database-connection.js';
import { schema } from '../../database/database.module.js';
import { user } from '../schema.js';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findById(userId: string) {
    const foundUser = await this.db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!foundUser) {
      throw new NotFoundException('User not found!');
    }

    return foundUser;
  }
}
