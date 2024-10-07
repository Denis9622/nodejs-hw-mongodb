// src/middlewares/authenticate.js

import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/user.js'; // Импорт модели пользователя

// Middleware для аутентификации пользователя
export async function authenticate(req, res, next) {
  try {
    // Получаем заголовок Authorization
    const authHeader = req.headers.authorization;

    // Проверяем, есть ли заголовок и начинается ли он с "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization token is required');
    }

    // Извлекаем токен из заголовка
    const token = authHeader.split(' ')[1];

    // Проверяем валидность токена
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Ищем пользователя по ID из токена
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    // Добавляем пользователя в объект запроса (req)
    req.user = user;

    // Переходим к следующему middleware или маршруту
    next();
  } catch (error) {
    // Проверяем, если токен истек
    if (error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Access token expired'));
    } else {
      next(createHttpError(401, 'Invalid access token'));
    }
  }
}
