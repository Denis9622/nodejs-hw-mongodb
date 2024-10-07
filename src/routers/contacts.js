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
import { authenticate } from '../middlewares/authenticate.js'; // Импортируем middleware для аутентификации
import {
  contactSchema,
  updateContactSchema,
} from '../validation/contactValidation.js';

const router = express.Router();

// Применяем middleware authenticate ко всем маршрутам контактов
router.use(authenticate);

// Роут для получения всех контактов с пагинацией и сортировкой
router.get('/', ctrlWrapper(getContactsController));

// Роут для получения контакта по ID (валидация ID)
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// Роут для создания нового контакта (валидация тела запроса)
router.post(
  '/',
  validateBody(contactSchema),
  ctrlWrapper(createContactController),
);

// Роут для обновления контакта (валидация ID и тела)
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

// Роут для удаления контакта (валидация ID)
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
