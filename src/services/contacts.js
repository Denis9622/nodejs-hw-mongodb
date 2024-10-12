import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import Contact from '../models/contact.js';

export async function getAllContactsWithPagination(
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
) {
  try {
    const skip = (page - 1) * perPage;
    const sortCriteria = { [sortBy]: sortOrder };

    const [contacts, totalItems] = await Promise.all([
      Contact.find(filter).skip(skip).limit(perPage).sort(sortCriteria),
      Contact.countDocuments(filter),
    ]);

    return { contacts, totalItems };
  } catch {
    throw createHttpError(500, 'Failed to retrieve contacts');
  }
}

export async function createContact(contactData) {
  try {
    const newContact = await Contact.create(contactData);
    return newContact;
  } catch {
    throw createHttpError(400, 'Failed to create contact');
  }
}

export async function updateContactById(contactId, userId, updateData) {
  try {
    // Проверяем валидность ID в сервисе
    if (
      !mongoose.Types.ObjectId.isValid(contactId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      throw createHttpError(400, 'Invalid contact ID or user ID format');
    }

    // Логирование для отладки
    console.log('Filter:', { _id: contactId, userId });
    console.log('Update data:', updateData);

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId }, // Фильтруем по ID контакта и пользователя
      updateData,
      { new: true, runValidators: true }, // Обновляем и проверяем валидацию
    );

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    return updatedContact;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw createHttpError(500, 'Failed to update contact');
  }
}

export async function deleteContactById(contactId, userId) {
  try {
    const deletedContact = await Contact.findOneAndDelete({
      _id: contactId,
      userId,
    });

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    return deletedContact;
  } catch  {
    throw createHttpError(500, 'Failed to delete contact');
  }
}

export async function getContactById(contactId, userId) {
  try {
    const contact = await Contact.findOne({ _id: contactId, userId });
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    return contact;
  } catch  {
    throw createHttpError(500, 'Failed to retrieve contact');
  }
}
