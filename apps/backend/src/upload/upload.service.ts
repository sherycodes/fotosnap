import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'images');

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const PRESIGNED_URL_TTL = 60;

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
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(join(UPLOAD_DIR, filename), file.buffer);
    return { filename };
  }

  async createPresignedUpload(contentType: string, size: number) {
    if (!EXTENSIONS[contentType]) {
      throw new BadRequestException(
        'Only PNG, JPEG, GIF and WebP images are allowed',
      );
    }
    if (!Number.isInteger(size) || size <= 0 || size > MAX_IMAGE_SIZE) {
      throw new BadRequestException('Image must be 10 MB or smaller');
    }
    if (!this.s3) {
      return { filename: null, uploadUrl: null };
    }

    const filename = `${randomUUID()}${EXTENSIONS[contentType]}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: `uploads/${filename}`,
      ContentType: contentType,
      ContentLength: size,
    });
    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: PRESIGNED_URL_TTL,
      signableHeaders: new Set(['content-type', 'content-length']),
    });

    return { filename, uploadUrl };
  }
}
