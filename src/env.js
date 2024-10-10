import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

export function env(name, defaultValue = undefined) {
  // Получаем значение переменной окружения
  const value = process.env[name];

  // Если переменная найдена, возвращаем её
  if (value) {
    return value;
  }

  // Если переменная не найдена, но есть значение по умолчанию, возвращаем его
  if (defaultValue !== undefined) {
    return defaultValue;
  }

  // Логируем ошибку для отладки
  console.error(
    `Ошибка: переменная окружения '${name}' не найдена и не задано значение по умолчанию.`,
  );

  // Выбрасываем ошибку, если переменная отсутствует
  throw new Error(`Missing: process.env['${name}'].`);
}
