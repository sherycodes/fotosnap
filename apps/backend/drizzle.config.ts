import { defineConfig } from 'drizzle-kit';
import * as fs from 'node:fs';
import * as path from 'node:path';

let certificate: string | undefined;
if (process.env.NODE_ENV === 'production') {
  certificate = fs.readFileSync(path.resolve('global-bundle.pem')).toString();
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/**/schema.ts',
  out: './drizzle',
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    port: parseInt(process.env.DATABASE_PORT!),
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
    ssl: certificate
      ? { ca: certificate, rejectUnauthorized: true }
      : undefined,
  },
});
