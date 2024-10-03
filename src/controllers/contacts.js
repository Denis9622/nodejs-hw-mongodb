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
    // Отримуємо значення page, perPage, sortBy і sortOrder з query параметрів
    const page = parseInt(req.query.page, 10) || 1; // Номер сторінки, за замовчуванням 1
    const perPage = parseInt(req.query.perPage, 10) || 10; // Кількість елементів на сторінці, за замовчуванням 10
    const sortBy = req.query.sortBy || 'name'; // Поле для сортування, за замовчуванням 'name'
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Порядок сортування (1 для asc, -1 для desc)

    // Отримуємо контакти з сервісу з врахуванням пагінації і сортування
    const { contacts, totalItems } = await getAllContactsWithPagination(
      page,
      perPage,
      sortBy,
      sortOrder,
    );

    // Визначаємо загальну кількість сторінок
    const totalPages = Math.ceil(totalItems / perPage);

    // Формуємо відповідь з інформацією про пагінацію і сортування
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts, // Масив контактів на поточній сторінці
        page, // Поточна сторінка
        perPage, // Кількість елементів на сторінці
        totalItems, // Загальна кількість контактів
        totalPages, // Загальна кількість сторінок
        hasPreviousPage: page > 1, // Чи є попередня сторінка
        hasNextPage: page < totalPages, // Чи є наступна сторінка
      },
    });
  } catch (error) {
    next(error); // Передаємо помилку в middleware для обробки
  }
}

// Контролер для отримання контакту за ID
export async function getContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

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
    const newContact = await createContact(req.body);
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
    const { contactId } = req.params;
    const updatedContact = await updateContactById(contactId, req.body);

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
    const { contactId } = req.params;
    const deletedContact = await deleteContactById(contactId);

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send(); // Статус 204 без тіла відповіді
  } catch (error) {
    next(error);
  }
}
