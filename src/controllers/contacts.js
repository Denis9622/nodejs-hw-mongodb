import createHttpError from 'http-errors';
import {
  getAllContactsWithPagination,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';

// Контролер для отримання всіх контактів з пагінацією і сортуванням
export async function getContactsController(req, res, next) {
  try {
    // Перевіряємо, чи пройшла аутентифікація і чи є користувач у запиті
    if (!req.user || !req.user._id) {
      throw createHttpError(401, 'Authentication required');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    // Отримуємо лише контакти, які належать поточному користувачеві
    const { contacts, totalItems } = await getAllContactsWithPagination(
      page,
      perPage,
      sortBy,
      sortOrder,
      { userId: req.user._id }, // Фільтр для вибірки контактів тільки поточного користувача
    );

    const totalPages = Math.ceil(totalItems / perPage);

    // Відправляємо успішну відповідь із даними
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        contacts, // Масив контактів користувача
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error); // Передаємо помилку в middleware для обробки
  }
}

// Контролер для отримання контакту за ID
export async function getContactByIdController(req, res, next) {
  try {
    const userId = req.user._id; // ID поточного користувача
    const { contactId } = req.params;

    // Отримуємо лише контакт поточного користувача
    const contact = await getContactById(contactId, userId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

// Контролер для створення нового контакту
export async function createContactController(req, res, next) {
  try {
    const userId = req.user._id; // Отримуємо ID поточного користувача
    const contactData = { ...req.body, userId }; // Додаємо userId до даних контакту

    const newContact = await createContact(contactData);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
}

// Контролер для оновлення існуючого контакту
export async function updateContactController(req, res, next) {
  try {
    const userId = req.user._id; // Отримуємо ID поточного користувача
    const { contactId } = req.params;

    // Оновлюємо лише контакт поточного користувача
    const updatedContact = await updateContactById(contactId, userId, req.body);

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
}

// Контролер для видалення контакту
export async function deleteContactController(req, res, next) {
  try {
    const userId = req.user._id; // Отримуємо ID поточного користувача
    const { contactId } = req.params;

    // Видаляємо лише контакт поточного користувача
    const deletedContact = await deleteContactById(contactId, userId);

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send(); // Статус 204 без тіла відповіді
  } catch (error) {
    next(error);
  }
}
