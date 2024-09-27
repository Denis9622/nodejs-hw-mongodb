import { parseEnv } from '../env.js'; // Імпортуємо утиліту для парсингу
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import './models/contact.js'; // Імпорт моделі для ініціалізації


// Парсимо змінні оточення з файлу .env
const envVars = parseEnv();
process.env = { ...process.env, ...envVars }; // Зберігаємо змінні в process.env

// Ініціалізуємо підключення до MongoDB і сервер
(async () => {
  try {
    await initMongoConnection(); // Підключаємося до MongoDB
    setupServer(); // Запускаємо сервер після підключення
  } catch (error) {
    console.error('Error during server initialization:', error);
  }
})();
