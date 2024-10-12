import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { env } from './../env.js'; // Подключение метода env для получения JWT_SECRET

const jwtSecret = env('JWT_SECRET'); // Убедитесь, что переменная загружена правильно

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded; // Если проверка прошла успешно, сохраняем данные пользователя в req
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Access token expired'));
    } else {
      next(createHttpError(401, 'Invalid or expired access token'));
    }
  }
};
