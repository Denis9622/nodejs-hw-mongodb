import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';
import createHttpError from 'http-errors'; // Імпорт createHttpError для генерації помилок

// Контролер для отримання всіх контактів
export async function getContactsController(req, res, next) {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error); // Передаємо помилку далі в middleware
  }
}

// Контролер для отримання контакту за ID
export async function getContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params; // Отримуємо contactId з параметрів запиту
    const contact = await getContactById(contactId);

    if (!contact) {
      // Якщо контакт не знайдено, генеруємо помилку 404
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error); // Передаємо помилку в middleware
  }
}

// Контролер для створення нового контакту
export async function createContactController(req, res, next) {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
      // Якщо обов'язкові поля відсутні, генеруємо помилку 400
      throw createHttpError(
        400,
        'Missing required fields: name, phoneNumber, or contactType',
      );
    }

    const newContact = await createContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });

    // Повертаємо статус 201 і дані створеного контакту
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error); // Передаємо помилку далі
  }
}

// Контролер для оновлення існуючого контакту
export async function updateContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    const updatedData = req.body;

    const updatedContact = await updateContactById(contactId, updatedData);

    if (!updatedContact) {
      // Якщо контакт не знайдено, генеруємо помилку 404
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error); // Передаємо помилку далі
  }
}

// Контролер для видалення контакту
export async function deleteContactController(req, res, next) {
  try {
    const { contactId } = req.params;
    const deletedContact = await deleteContactById(contactId);

    if (!deletedContact) {
      // Якщо контакт не знайдено, генеруємо помилку 404
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send(); // Повертаємо статус 204 без тіла відповіді
  } catch (error) {
    next(error); // Передаємо помилку далі
  }
}
