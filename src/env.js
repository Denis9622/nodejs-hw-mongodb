import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущий путь (__dirname не доступен в ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения из .env файла
dotenv.config({ path: path.resolve(__dirname, './../.env') });

// Теперь переменные окружения автоматически загружены в process.env
// Вы можете получить доступ к переменным через process.env, например:
// const dbUser = process.env.MONGODB_USER;
// const dbPassword = process.env.MONGODB_PASSWORD;

export function parseEnv() {
  // Если нужно, вы можете обрабатывать process.env далее или просто возвращать его
  return process.env;
}
