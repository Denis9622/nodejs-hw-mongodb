// src/routers/auth.js

import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js'; // Middleware для валидации тела запроса
import {
  userRegisterSchema,
  userLoginSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/userValidation.js'; // Схемы валидации
import {
  createUserController,
  loginUserController,
  refreshSessionController,
  logoutUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js'; // Контроллеры


const router = express.Router();

// Маршрут для регистрации пользователя
router.post(
  '/register',
  validateBody(userRegisterSchema),
  ctrlWrapper(createUserController),
);

// Маршрут для логина пользователя
router.post(
  '/login',
  validateBody(userLoginSchema), // Валидация тела запроса для логина
  ctrlWrapper(loginUserController), // Контроллер для логина
);

// Маршрут для обновления сессии по refresh токену
router.post(
  '/refresh',
  ctrlWrapper(refreshSessionController), // Контроллер для обновления сессии
);

// Маршрут для логаута пользователя
router.post('/logout', ctrlWrapper(logoutUserController)); // Добавляем контроллер для логаута

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
//Роут для запиту на скидання паролю

