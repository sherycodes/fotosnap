import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  const uploadsPath = join(process.cwd(), 'uploads', 'images');
  app.useStaticAssets(uploadsPath, { prefix: '/uploads/' });
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
