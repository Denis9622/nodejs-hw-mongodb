import User from '../models/user.js'; // Импортируем модель пользователя
import Session from '../models/session.js'; // Импортируем модель сессии
import createHttpError from 'http-errors'; // Для создания HTTP ошибок
import bcrypt from 'bcrypt'; // Для хеширования паролей
import jwt from 'jsonwebtoken'; // Для работы с JWT токенами
import { requestResetToken } from '../services/auth.js';


// Секреты и настройки для токенов (их следует хранить в переменных окружения)
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey'; // Секрет для JWT токенов
const JWT_EXPIRES_IN = '15m'; // Время жизни access токена — 15 минут
const REFRESH_TOKEN_EXPIRES_IN = '30d'; // Время жизни refresh токена — 30 дней


// export const createUserController = async (req, res, next) => {
//   try {
//     // Получаем загруженный файл (если он есть)
//     const photo = req.file;
//     console.log('Uploaded file:', req.file);
//     let photoUrl;

//     // Если файл фото передан, сохраняем его
//     if (photo) {
//       if (env('ENABLE_CLOUDINARY') === 'true') {
//         // Сохраняем фото в Cloudinary и получаем URL
//         photoUrl = await saveFileToCloudinary(photo);
//       } else {
//         // Сохраняем фото локально и получаем путь
//         photoUrl = await saveFileToUploadDir(photo);
//       }
//     }

//     const { name, email, password } = req.body;

//     // Проверяем, существует ли пользователь с таким email
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       throw createHttpError(409, 'Email in use'); // Ошибка 409, если email уже используется
//     }

//     // Хешируем пароль перед сохранением
//     const hashedPassword = await bcrypt.hash(password, 10); // Хеширование пароля

//     // Создаем нового пользователя
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       photo: photoUrl, // Сохраняем URL фотографии
//     });

//     // Возвращаем успешный ответ с информацией о пользователе (без пароля)
//     res.status(201).json({
//       status: 201,
//       message: 'User successfully registered!',
//       data: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         photo: newUser.photo, // Возвращаем URL фотографии
//       },
//     });
//   } catch (error) {
//     next(error); // Передаем ошибку в middleware для обработки
//   }
// };
//Контроллер для создания нового пользователя (регистрация)
export async function createUserController(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'Email in use'); // Ошибка 409, если email уже используется
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

    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // Токен на 15 минут
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Токен на 30 дней

    // Создаем новую сессию и сохраняем её в базе данных
    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    // Устанавливаем refresh токен в cookies (например, на 30 дней)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Ограничиваем доступ к cookie только через HTTP (защита от XSS)
      secure: process.env.NODE_ENV === 'production', // Включаем secure только в продакшене
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    });


    // Возвращаем успешный ответ с access токеном
    res.status(200).json({
      status: 200,
      message: 'Пользователь успешно авторизован!',
      data: { accessToken },
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
      expiresIn: JWT_EXPIRES_IN, // 15 минут
    });
    const newRefreshToken = jwt.sign({ userId: session.userId }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN, // 30 дней
    });

    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // Новый access токен на 15 минут
    const refreshTokenValidUntil = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ); // Новый refresh токен на 30 дней

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
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
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

    // Логирование для отладки
    console.log('Received refreshToken:', refreshToken);

    // Проверяем, передан ли refresh токен
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token required'); // Ошибка 401, если токен отсутствует
    }

    // Проверка наличия сессии в базе данных
    const session = await Session.findOneAndDelete({ refreshToken });

    console.log('Session found:', session);

    if (!session) {
      throw createHttpError(404, 'Session not found');
    }

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




//Контролер для запиту на скидання паролю
export const requestResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    await requestResetToken(email);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};


export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Поиск пользователя по ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    // Хеширование нового пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Обновление пароля
    user.password = hashedPassword;
    await user.save();

    // Удаление активных сессий пользователя
    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
    });
  } catch (error) {
    next(error);
  }
};
