import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/user.js'; // Модель користувача

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1]; // Виділяємо токен з заголовка

    // Перевіряємо і верифікуємо токен
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    // Додаємо користувача до об'єкта req
    req.user = user;
    next();
  } catch (error) {
    next(error); // Обробка помилки
  }
};
