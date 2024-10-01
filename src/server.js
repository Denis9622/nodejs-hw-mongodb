import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js'; // Імпорт роутера для контактів
import { errorHandler } from './middlewares/errorHandler.js'; // Імпорт обробки помилок
import { notFoundHandler } from './middlewares/notFoundHandler.js'; // Імпорт обробки неіснуючих маршрутів

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json()); // Для обробки JSON тіла запитів

  // Підключаємо маршрути для контактів з префіксом /api/contacts
  app.use('/api/contacts', contactsRouter);

  // Middleware для обробки неіснуючих маршрутів
  app.use(notFoundHandler);

  // Middleware для обробки помилок
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
