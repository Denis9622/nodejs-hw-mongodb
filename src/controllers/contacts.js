import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById, // Імпортуємо функцію для видалення контакту
} from '../services/contacts.js';
import createError from 'http-errors';

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
    next(error);
  }
}

// Контролер для отримання контакту за ID
export async function getContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      throw createError(404, 'Contact not found');
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
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
      throw createError(
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
    const updatedData = req.body;

    const updatedContact = await updateContactById(contactId, updatedData);

    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
}

// ДОДАНО: Контролер для видалення контакту
export async function deleteContactController(req, res, next) {
  try {
    const { contactId } = req.params;

    // Викликаємо сервіс для видалення контакту
    const deletedContact = await deleteContactById(contactId);

    if (!deletedContact) {
      // Якщо контакт не знайдено, повертаємо помилку 404
      throw createError(404, 'Contact not found');
    }

    // Якщо видалення успішне, повертаємо статус 204 без тіла
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
