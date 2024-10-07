// src/controllers/auth.js

import { registerUser, loginUser, refreshSession, logoutUser  } from '../services/auth.js'; // Импортируем сервисы для регистрации и логина
import createHttpError from 'http-errors'; // Для возврата HTTP ошибок

export const createUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

// Контроллер для логина пользователя
export async function loginUserController(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createHttpError(400, 'Email and password are required'); // Ошибка 400, если данные неполные
    }

    // Логин пользователя через сервис
    const { accessToken, refreshToken } = await loginUser({ email, password });

    // Устанавливаем refresh токен в cookies (например, на 30 дней)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    });

    // Возвращаем access токен в теле ответа
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error); // Передаем ошибку в следующий middleware
  }
}

// Контроллер для обновления сессии
export async function refreshSessionController(req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided'); // Ошибка 401, если refresh токен отсутствует
    }

    // Обновляем сессию через сервис
    const { accessToken, newRefreshToken } = await refreshSession(refreshToken);

    // Обновляем refresh токен в cookies
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    });

    // Возвращаем новый access токен в ответе
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error); // Передаем ошибку в следующий middleware
  }
}

// Контроллер для логаута пользователя
export async function logoutUserController(req, res, next) {
  try {
    const { refreshToken } = req.cookies; // Получаем refresh токен из cookies

    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided'); // Ошибка 401, если токен отсутствует
    }

    // Удаляем сессию через сервис
    await logoutUser(refreshToken);

    // Очищаем cookies
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // Возвращаем статус 204, без тела
    res.status(204).send();
  } catch (error) {
    next(error); // Передаем ошибку в middleware для обработки
  }
}
