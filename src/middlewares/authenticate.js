import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/user.js'; // Модель користувача

// Використовуємо секрет для підпису та верифікації JWT токенів
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

// Middleware для аутентифікації
export const authenticate = async (req, res, next) => {
  try {
    // Отримуємо заголовок Authorization
    const authHeader = req.headers.authorization;

    // Якщо заголовка немає або він неправильно сформований
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header missing or malformed');
    }

    // Вилучаємо сам токен
    const token = authHeader.split(' ')[1];

    // Верифікуємо токен і декодуємо його
    const decoded = jwt.verify(token, JWT_SECRET);

    // Знаходимо користувача за ID з токену
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    // Додаємо дані користувача до запиту
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Access token expired'));
    } else if (error.name === 'JsonWebTokenError') {
      next(createHttpError(401, 'Invalid access token'));
    } else {
      next(error); // Інші помилки передаються в обробник помилок
    }
  }
};
