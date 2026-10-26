import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './upload.config.ts';
import { UploadController } from './upload.controller.ts';
import { UploadService } from './upload.service.ts';

@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
