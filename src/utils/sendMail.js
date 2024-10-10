import nodemailer from 'nodemailer';
import { SMTP } from '../constants/contacts-constants.js';
import { env } from './../env.js';

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
  } catch {
    throw new Error('Failed to send the email, please try again later.');
  }
};
