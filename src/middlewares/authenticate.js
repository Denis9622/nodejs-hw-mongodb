import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import Session from '../models/session.js'; // Модель сесії
import User from '../models/user.js'; // Модель користувача
import { env } from './../env.js'; // Импорт функции env для получения переменных окружения


// Middleware для аутентификации
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env('JWT_SECRET')); // Правильный вызов env()

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createHttpError(401, 'Invalid or expired access token');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Access token expired'));
    } else if (error.name === 'JsonWebTokenError') {
      next(createHttpError(401, 'Invalid access token'));
    } else {
      next(error);
    }
  }
};
