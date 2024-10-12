import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js'; // Импорт маршрутов для контактов
import authRouter from './routers/auth.js'; // Импорт маршрутов для аутентификации
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/contacts-constants.js';




export function setupServer() {
  const app = express();

  // Додайте middleware cookieParser перед іншими роутами
  app.use(cookieParser());
  app.use(cors());
  app.use(pino());
  app.use(express.json()); // Для обработки JSON тела запросов

  // Маршрут для контактов
  app.use('/contacts', contactsRouter);

  // Маршрут для аутентификации (например, /auth/login и /auth/register)
  app.use('/auth', authRouter); // Добавлен роутер для аутентификации

  // Middleware для обработки несуществующих маршрутов
  app.use(notFoundHandler);

  // Middleware для обработки ошибок
  app.use(errorHandler);

   app.use('/uploads', express.static(UPLOAD_DIR));


  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
