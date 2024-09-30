import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController, // Додаємо контролер для видалення контакту
} from '../controllers/contacts.js';

const router = express.Router();

// Роут для отримання всіх контактів
router.get('/contacts', ctrlWrapper(getContactsController));

// Роут для отримання контакту за ID
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

// Роут для створення нового контакту
router.post('/contacts', ctrlWrapper(createContactController));

// Роут для оновлення існуючого контакту
router.patch('/contacts/:contactId', ctrlWrapper(updateContactController));

// ДОДАНО: Роут для видалення контакту за ID
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController)); // Додано DELETE роут

export default router;
