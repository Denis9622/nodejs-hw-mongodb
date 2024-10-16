import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущий путь (__dirname не доступен в ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Формируем путь к db.json
const PATH_DB = path.join(__dirname, '../db/db.json');

// Экспортируем путь
export { PATH_DB };

  export const contactTypeList = ['work', 'home', 'personal'];
  export const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc',
  };

  export const FIFTEEN_MINUTES = 15 * 60 * 1000;
  export const ONE_DAY = 24 * 60 * 60 * 1000;

  export const ROLES = {
    TEACHER: 'teacher',
    PARENT: 'parent',
  };

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
};

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
