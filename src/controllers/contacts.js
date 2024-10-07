import createHttpError from 'http-errors';
import {
  getAllContactsWithPagination,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';

// Контроллер для получения всех контактов с пагинацией и сортировкой
export async function getContactsController(req, res, next) {
  try {
    const userId = req.user._id; // Получаем ID текущего пользователя
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    // Получаем только контакты, принадлежащие текущему пользователю
    const { contacts, totalItems } = await getAllContactsWithPagination(
      page,
      perPage,
      sortBy,
      sortOrder,
      userId, // Передаем userId в сервис
    );

    const totalPages = Math.ceil(totalItems / perPage);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Контроллер для получения контакта по ID
export async function getContactByIdController(req, res, next) {
  try {
    const userId = req.user._id; // ID текущего пользователя
    const { contactId } = req.params;

    // Получаем только контакт текущего пользователя
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

// Контроллер для создания нового контакта
export async function createContactController(req, res, next) {
  try {
    const userId = req.user._id; // Получаем ID текущего пользователя
    const contactData = { ...req.body, userId }; // Добавляем userId к данным контакта

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

// Контроллер для обновления существующего контакта
export async function updateContactController(req, res, next) {
  try {
    const userId = req.user._id; // Получаем ID текущего пользователя
    const { contactId } = req.params;

    // Обновляем только контакт текущего пользователя
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

// Контроллер для удаления контакта
export async function deleteContactController(req, res, next) {
  try {
    const userId = req.user._id; // Получаем ID текущего пользователя
    const { contactId } = req.params;

    // Удаляем только контакт текущего пользователя
    const deletedContact = await deleteContactById(contactId, userId);

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send(); // Статус 204 без тела ответа
  } catch (error) {
    next(error);
  }
}
