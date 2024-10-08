import User from '../models/user.js'; // Импортируем модель пользователя
import Session from '../models/session.js'; // Импортируем модель сессии
import createHttpError from 'http-errors'; // Для создания HTTP ошибок
import bcrypt from 'bcrypt'; // Для хеширования паролей
import jwt from 'jsonwebtoken'; // Для работы с JWT токенами

// Секреты и настройки для токенов (обычно их хранят в переменных окружения)
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey'; // Секрет для JWT токенов
const JWT_EXPIRES_IN = '1h'; // Время жизни access токена
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // Время жизни refresh токена

// Контроллер для создания нового пользователя (регистрация)
export async function createUserController(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(400, 'User with this email already exists'); // Если пользователь существует, возвращаем ошибку
    }

    // Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10); // Хеширование пароля

    // Создаем нового пользователя
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Возвращаем успешный ответ с информацией о пользователе (без пароля)
    res.status(201).json({
      status: 201,
      message: 'User successfully registered!',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error); // Передаем ошибку в middleware для обработки
  }
}

// Контроллер для логина пользователя
export async function loginUserController(req, res, next) {
  try {
    const { email, password } = req.body;

    // Проверяем, переданы ли email и пароль
    if (!email || !password) {
      throw createHttpError(400, 'Email и пароль обязательны'); // Ошибка 400, если данные неполные
    }

    // Ищем пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'Неправильный email или пароль'); // Ошибка 401, если пользователь не найден
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, 'Неправильный email или пароль'); // Ошибка 401, если пароль неверный
    }

    // Создаем access и refresh токены с использованием JWT
    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    const accessTokenValidUntil = new Date(Date.now() + 60 * 60 * 1000); // Токен на 1 час
    const refreshTokenValidUntil = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ); // Токен на 7 дней

    // Создаем новую сессию и сохраняем её в базе данных
    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    // Устанавливаем refresh токен в cookies (например, на 7 дней)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Ограничиваем доступ к cookie только через HTTP (защита от XSS)
      secure: process.env.NODE_ENV === 'production', // Включаем secure только в продакшене
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    // Возвращаем успешный ответ с access токеном
    res.status(200).json({
      status: 200,
      message: 'Пользователь успешно авторизован!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error); // Передаем ошибку в следующий middleware для обработки
  }
}

// Контроллер для обновления сессии (по refresh токену)
export async function refreshSessionController(req, res, next) {
  try {
    const { refreshToken } = req.cookies; // Получаем refresh токен из cookies

    // Проверяем, передан ли refresh токен
    if (!refreshToken) {
      throw createHttpError(401, 'Отсутствует refresh токен'); // Ошибка 401, если токен отсутствует
    }

    // Ищем сессию с этим refresh токеном
    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createHttpError(401, 'Недействительный refresh токен'); // Ошибка 401, если сессия не найдена
    }

    // Проверяем, истек ли refresh токен
    if (new Date() > session.refreshTokenValidUntil) {
      throw createHttpError(401, 'Refresh токен истек'); // Ошибка 401, если токен истек
    }

    // Генерируем новый access токен
    const accessToken = jwt.sign({ userId: session.userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const newRefreshToken = jwt.sign({ userId: session.userId }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    const accessTokenValidUntil = new Date(Date.now() + 60 * 60 * 1000); // Новый access токен на 1 час
    const refreshTokenValidUntil = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ); // Новый refresh токен на 7 дней

    // Обновляем сессию в базе данных
    session.accessToken = accessToken;
    session.refreshToken = newRefreshToken;
    session.accessTokenValidUntil = accessTokenValidUntil;
    session.refreshTokenValidUntil = refreshTokenValidUntil;
    await session.save();

    // Обновляем refresh токен в cookies
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    // Возвращаем новый access токен
    res.status(200).json({
      status: 200,
      message: 'Сессия успешно обновлена!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error); // Передаем ошибку в следующий middleware для обработки
  }
}

// Контроллер для выхода пользователя (logout)
export async function logoutUserController(req, res, next) {
  try {
    const { refreshToken } = req.cookies; // Получаем refresh токен из cookies

    // Проверяем, передан ли refresh токен
    if (!refreshToken) {
      throw createHttpError(401, 'Отсутствует refresh токен'); // Ошибка 401, если токен отсутствует
    }

    // Удаляем сессию с этим refresh токеном из базы данных
    await Session.findOneAndDelete({ refreshToken });

    // Очищаем cookies с refresh токеном
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // Возвращаем успешный ответ без тела
    res.status(204).send();
  } catch (error) {
    next(error); // Передаем ошибку в следующий middleware для обработки
  }
}
