import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущий путь (__dirname не доступен в ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Формируем путь к db.json
const PATH_DB = path.join(__dirname, '../db/db.json');

// Экспортируем путь
export { PATH_DB };
