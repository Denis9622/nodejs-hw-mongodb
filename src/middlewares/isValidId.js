import mongoose from 'mongoose';
import createHttpError from 'http-errors';

// Middleware для проверки валидности ID
export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID format'));
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(createHttpError(400, 'Invalid user ID format'));
  }

  next();
};
