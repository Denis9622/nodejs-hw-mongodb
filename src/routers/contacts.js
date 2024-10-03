import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  contactSchema,
  updateContactSchema,
} from '../validation/contactValidation.js';

const router = express.Router();

// Роут для отримання всіх контактів з пагінацією та сортуванням
// ДОДАНО: можливість отримувати контакти за сторінками через query параметри `page`, `perPage`, `sortBy`, `sortOrder`
router.get('/', ctrlWrapper(getContactsController));

// Роут для отримання контакту за ID (перевіряємо валідність ID)
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// Роут для створення нового контакту (валидація тіла)
router.post(
  '/',
  validateBody(contactSchema),
  ctrlWrapper(createContactController),
);

// Роут для оновлення контакту (валидація ID і тіла)
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

// Роут для видалення контакту (валидація ID)
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
