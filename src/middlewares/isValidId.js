import mongoose from 'mongoose';
import createHttpError from 'http-errors';

export function isValidId(req, res, next) {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID'));
  }

  next(); // Якщо ID валідний
}
