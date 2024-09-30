// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json()); // Для обработки JSON тела запросов

  // Роуты
  // app.use('/contacts', contactsRouter);

  // Маршруты
  app.use('/api/contacts', contactsRouter);


  // Middleware для обработки несуществующих маршрутов
  app.use(notFoundHandler);

  // Middleware для обработки ошибок
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
