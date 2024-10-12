import dotenv from 'dotenv';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import './models/contact.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/contacts-constants.js';

dotenv.config();

// (async () => {
//   try {
//     await initMongoConnection(); // Подключение к MongoDB
//     setupServer(); // Запуск сервера после подключения
//   } catch (error) {
//     console.error('Error during server initialization:', error);
//   }
// })();

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};

void bootstrap();
