import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';

export const auth = betterAuth({
  database: drizzleAdapter(
    {},
    {
      provider: 'pg',
    },
  ),
});
