// src/utils/ctrlWrapper.js
export function ctrlWrapper(ctrl) {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (err) {
      next(err); // Передаём ошибку в следующий middleware (errorHandler)
    }
  };
}
