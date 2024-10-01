import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

const router = express.Router();

// Роут для отримання всіх контактів
router.get('/', ctrlWrapper(getContactsController));

// Роут для отримання контакту за ID
router.get('/:contactId', ctrlWrapper(getContactByIdController));

// Роут для створення нового контакту
router.post('/', ctrlWrapper(createContactController));

// Роут для оновлення існуючого контакту
router.patch('/:contactId', ctrlWrapper(updateContactController));

// Роут для видалення контакту за ID
router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
