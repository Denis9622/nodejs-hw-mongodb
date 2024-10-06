import Contact from '../models/contact.js'; // Імпорт моделі Contact

// Сервіс для отримання контактів з пагінацією та сортуванням
export async function getAllContactsWithPagination(
  page,
  perPage,
  sortBy,
  sortOrder,
) {
  const skip = (page - 1) * perPage; // Пропускаємо певну кількість записів для пагінації
  const sortCriteria = { [sortBy]: sortOrder }; // Застосовуємо сортування

  const [contacts, totalItems] = await Promise.all([
    Contact.find().skip(skip).limit(perPage).sort(sortCriteria), // Отримуємо контакти
    Contact.countDocuments(), // Підраховуємо загальну кількість контактів
  ]);

  return { contacts, totalItems };
}

// Сервіс для отримання контакту за ID
export async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.error(`Error fetching contact with id ${contactId}:`, error);
    throw new Error(`Error fetching contact: ${error.message}`);
  }
}

// Сервіс для отримання всіх контактів без пагінації та сортування (для прикладу)
export async function getAllContacts() {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Failed to fetch contacts');
  }
}
