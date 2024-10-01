export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    status,
    message,
    data: err.data || null, // Додаємо можливість повертати дані помилки
  });
}
