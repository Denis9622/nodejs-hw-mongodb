import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/contacts-constants.js';
import { swaggerServe, swaggerDocs } from './middlewares/swaggerDocs.js';

export function setupServer() {
  const app = express();

  app.use(cookieParser());
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Подключаем Swagger UI по роуту /api-docs
  console.log('Setting up Swagger...');
  app.use('/api-docs', swaggerServe, swaggerDocs());

  // Маршрут для контактов
  app.use('/contacts', contactsRouter);

  // Маршрут для аутентификации (например, /auth/login и /auth/register)
  app.use('/auth', authRouter); // Добавлен роутер для аутентификации

  // Middleware для обработки несуществующих маршрутов
  app.use(notFoundHandler);

  // Middleware для обработки ошибок
  app.use(errorHandler);

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use((req, res, next) => {
    res.status(404).json({
      status: 404,
      message: 'Route not found',
      data: null,
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
