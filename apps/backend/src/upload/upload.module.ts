import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './upload.config.ts';
import { UploadController } from './upload.controller.ts';
import { UploadService } from './upload.service.ts';

@Module({
  imports: [ConfigModule, MulterModule.register(multerConfig)],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
