import dotenv from 'dotenv'; // Підключаємо dotenv для автоматичного завантаження змінних з .env
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import './models/contact.js'; // Імпорт моделі для ініціалізації

// Завантажуємо змінні середовища з .env файлу
dotenv.config(); 

// Ініціалізуємо підключення до MongoDB і сервер
(async () => {
  try {
    await initMongoConnection(); // Підключаємося до MongoDB
    setupServer(); // Запускаємо сервер після підключення
  } catch (error) {
    console.error('Error during server initialization:', error);
  }
})();
