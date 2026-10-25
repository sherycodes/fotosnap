import { Injectable } from '@nestjs/common';
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
  async uploadImage(file: Express.Multer.File) {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${randomUUID()}${EXTENSIONS[file.mimetype]}`;
    await writeFile(join(UPLOAD_DIR, filename), file.buffer);
    return { filename };
  }
}
