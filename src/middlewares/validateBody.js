// src/middlewares/validateBody.js

import createHttpError from 'http-errors';

// Middleware для валидации тела запроса
export function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(createHttpError(400, error.message)); // Возвращаем ошибку 400 при неверных данных
    }
    next(); // Если валидация успешна, передаем управление дальше
  };
}
