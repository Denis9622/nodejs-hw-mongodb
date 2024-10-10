import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { SMTP } from '../constants/contacts-constants.js';
import { env } from './../env.js';
import { fileURLToPath } from 'url';
// Получаем текущий путь (__dirname не доступен в ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения из .env файла
dotenv.config({ path: path.resolve(__dirname, './../.env') });

// Настройка транспортера для отправки писем через nodemailer
const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST), // Получаем хост из переменных окружения через функцию env()
  port: Number(env(SMTP.SMTP_PORT)), // Получаем порт из переменных окружения
  auth: {
    user: env(SMTP.SMTP_USER), // Пользователь SMTP
    pass: env(SMTP.SMTP_PASSWORD), // Пароль SMTP
  },
});

// Функция для отправки письма
export const sendEMail = async (mailOptions) => {
  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Failed to send the email, please try again later:', error);
    throw new Error('Failed to send the email, please try again later');
  }
};
//Failed to send the email, please try again later
