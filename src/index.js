import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

// Ініціалізуємо підключення до MongoDB
(async () => {
  await initMongoConnection(); // Спочатку підключаємося до бази
  setupServer(); // Тоді запускаємо сервер
})();
