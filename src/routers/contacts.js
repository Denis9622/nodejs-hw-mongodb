import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js'; // Middleware для аутентификации
import {
  contactSchema,
  updateContactSchema,
} from '../validation/contactValidation.js';
import { upload } from '../middlewares/multer.js'; // Middleware для загрузки файлов

const router = express.Router();

// Применяем middleware authenticate ко всем маршрутам контактов
router.use(authenticate);

// Роут для получения всех контактов с пагинацией и сортировкой
router.get('/', ctrlWrapper(getContactsController));

// Роут для получения контакта по ID (с валидацией ID)
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// Роут для создания нового контакта (с обработкой файла и валидацией тела запроса)
router.post(
  '/',
  upload.single('photo'), // Обработка загруженного файла (фото)
  validateBody(contactSchema), // Валидация данных контакта
  ctrlWrapper(createContactController),
);

// Роут для обновления контакта
router.patch(
  '/:contactId',
  isValidId, // Используем middleware для проверки ID
  upload.single('photo'), // Обработка загруженного файла (фото)
  validateBody(updateContactSchema), // Валидация обновленных данных контакта
  ctrlWrapper(patchContactController),
);

// Роут для удаления контакта (с валидацией ID)
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
