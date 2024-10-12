import createHttpError from 'http-errors';

// Middleware для валидации тела запроса
export function validateBody(schema) {
  return (req, res, next) => {
    // Проверяем, есть ли файл и переданы ли остальные поля
    const dataToValidate = req.body; // В `form-data` текстовые поля находятся в `req.body`

    // Валидация тела запроса по схеме
    const { error } = schema.validate(dataToValidate);
    if (error) {
      return next(createHttpError(400, error.message)); // Возвращаем ошибку 400 при неверных данных
    }
    next(); // Если валидация успешна, передаем управление дальше
  };
}
