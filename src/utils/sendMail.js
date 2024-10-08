import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущий путь (__dirname не доступен в ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения из .env файла
dotenv.config({ path: path.resolve(__dirname, './../.env') });

// Настройка транспортера для отправки писем через nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Получаем хост из переменных окружения
  port: Number(process.env.SMTP_PORT), // Получаем порт из переменных окружения
  auth: {
    user: process.env.SMTP_USER, // Пользователь SMTP
    pass: process.env.SMTP_PASSWORD, // Пароль SMTP
  },
});

// Функция для отправки письма
export const sendEMail = async (mailOptions) => {
  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
