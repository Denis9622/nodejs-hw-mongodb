import createHttpError from 'http-errors'; // Для роботи з HTTP-помилками
import Contact from '../models/contact.js'; // Імпорт моделі Contact

// Сервіс для отримання контактів з пагінацією, сортуванням і фільтрацією
export async function getAllContactsWithPagination(
  page,
  perPage,
  sortBy,
  sortOrder,
  filter, // Додаємо фільтр
) {
  try {
    const skip = (page - 1) * perPage;
    const sortCriteria = { [sortBy]: sortOrder };

    // Використовуємо фільтр у запиті до бази даних
    const [contacts, totalItems] = await Promise.all([
      Contact.find(filter).skip(skip).limit(perPage).sort(sortCriteria),
      Contact.countDocuments(filter), // Підраховуємо кількість документів з фільтром
    ]);

    return { contacts, totalItems };
  } catch (error) {
    console.error('Error fetching contacts with filter:', error);
    throw createHttpError(500, 'Failed to retrieve contacts');
  }
}

// Сервіс для створення нового контакту
export async function createContact(contactData) {
  try {
    const newContact = await Contact.create(contactData);
    return newContact;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw createHttpError(400, 'Failed to create contact');
  }
}

// Сервіс для оновлення контакту за ID та userId
export async function updateContactById(contactId, userId, updateData) {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId }, // Пошук за ID і userId
      updateData,
      { new: true, runValidators: true }, // Повертаємо оновлений контакт і застосовуємо валідацію
    );

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    return updatedContact;
  } catch (error) {
    console.error(`Error updating contact with id ${contactId}:`, error);
    throw createHttpError(500, 'Failed to update contact');
  }
}

// Сервіс для видалення контакту за ID та userId
export async function deleteContactById(contactId, userId) {
  try {
    const deletedContact = await Contact.findOneAndDelete({
      _id: contactId,
      userId, // Перевіряємо, що контакт належить поточному користувачу
    });

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    return deletedContact;
  } catch (error) {
    console.error(`Error deleting contact with id ${contactId}:`, error);
    throw createHttpError(500, 'Failed to delete contact');
  }
}

// Сервіс для отримання контакту за ID та userId
export async function getContactById(contactId, userId) {
  try {
    const contact = await Contact.findOne({ _id: contactId, userId }); // Пошук за ID і userId
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    return contact;
  } catch (error) {
    console.error(`Error fetching contact with id ${contactId}:`, error);
    throw createHttpError(500, 'Failed to retrieve contact');
  }
}
