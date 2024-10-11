import dotenv from 'dotenv';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import './models/contact.js';

dotenv.config();

(async () => {
  try {
    await initMongoConnection(); // Подключение к MongoDB
    setupServer(); // Запуск сервера после подключения
  } catch (error) {
    console.error('Error during server initialization:', error);
  }
})();
