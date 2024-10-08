import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import path from 'path';
import fs from 'fs/promises';
import handlebars from 'handlebars';
import { sendEMail } from '../utils/sendMail.js'; // Импортируем сервис отправки почты
import User from '../models/user.js'; // Импорт модели пользователя
import Session from '../models/session.js'; // Импорт модели сессии

// Константы для работы с токенами и паролями
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey'; // Секретный ключ для токенов
const ACCESS_TOKEN_EXPIRES_IN = '15m'; // Время жизни access токена
const REFRESH_TOKEN_EXPIRES_IN = '30d'; // Время жизни refresh токена
const RESET_TOKEN_EXPIRES_IN = '15m'; // Время жизни токена сброса пароля
const RESET_PASSWORD_TEMPLATES_DIR = './path_to_templates_dir'; // Путь к шаблонам для сброса пароля

// =========================== Сервис для регистрации пользователя ===========================
export async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Хеширование пароля
  const newUser = await User.create({ name, email, password: hashedPassword });
  return newUser;
}

// =========================== Сервис для логина пользователя ===========================
export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  await Session.findOneAndDelete({ userId: user._id });
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
}

// =========================== Сервис для генерации токена сброса пароля ===========================
export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // Генерация токена сброса пароля
  const resetToken = jwt.sign({ sub: user._id, email }, JWT_SECRET, {
    expiresIn: RESET_TOKEN_EXPIRES_IN,
  });

  // Чтение шаблона письма для сброса пароля
  const resetPasswordTemplatePath = path.join(
    RESET_PASSWORD_TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = handlebars.compile(templateSource);

  // Создание HTML контента письма
  const html = template({
    name: user.name,
    link: `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`,
  });

  // Отправка письма
  await sendEMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset your password',
    html,
  });
};

// =========================== Сервис для сброса пароля ===========================
export const resetPassword = async (payload) => {
  let decoded;

  try {
    // Проверка и верификация токена сброса пароля
    decoded = jwt.verify(payload.token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    throw createHttpError(401, 'Invalid or expired token');
  }

  // Поиск пользователя по decoded email и id
  const user = await User.findOne({ email: decoded.email, _id: decoded.sub });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // Хеширование нового пароля
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
};

// =========================== Сервис для обновления сессии ===========================
export async function refreshSession(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    await Session.findOneAndDelete({ userId: user._id, refreshToken });

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    await Session.create({
      userId: user._id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error(error);
    throw createHttpError(401, 'Invalid refresh token');
  }
}

// =========================== Вспомогательные функции ===========================
function generateAccessToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

// =========================== Сервис для логаута пользователя ===========================
export async function logoutUser(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const session = await Session.findOneAndDelete({
      userId: decoded.userId,
      refreshToken,
    });

    if (!session) {
      throw createHttpError(404, 'Session not found');
    }
  } catch (error) {
    console.error(error);
    throw createHttpError(401, 'Invalid token or session');
  }
}
