import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerConfig: MulterOptions = {
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
};
