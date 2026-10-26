import { Request, Response } from 'express';
import { session, user } from './auth/schema.ts';

export interface IAppContext {
  req: Request;
  res: Response;
  user: typeof user.$inferSelect;
  session: typeof session.$inferSelect;
}
