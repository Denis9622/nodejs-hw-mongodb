import dotenv from 'dotenv';

// Загружаем переменные среды из .env файла
dotenv.config();

export function env(name, defaultValue = undefined) {
  const value = process.env[name];
  if (value) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  console.error(
    `Ошибка: переменная среды '${name}' не найдена и не задано значение по умолчанию.`,
  );
  throw new Error(`Missing: process.env['${name}'].`);
}
