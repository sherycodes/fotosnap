import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'images');

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

@Injectable()
export class UploadService {
  private readonly bucket: string | undefined;
  private readonly s3: S3Client | undefined;

  constructor(configService: ConfigService) {
    this.bucket = configService.get<string>('S3_BUCKET_NAME');
    if (this.bucket) {
      this.s3 = new S3Client({ region: configService.get('AWS_REGION') });
    }
  }

  async uploadImage(file: Express.Multer.File) {
    const filename = `${randomUUID()}${EXTENSIONS[file.mimetype]}`;

    if (this.s3) {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: `uploads/${filename}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      );
    } else {
      await mkdir(UPLOAD_DIR, { recursive: true });
      await writeFile(join(UPLOAD_DIR, filename), file.buffer);
    }

    return { filename };
  }
}
