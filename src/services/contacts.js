import Contact from '../models/contact.js'; // Імпорт моделі контакту

export async function getAllContacts() {
  try {
    // Отримуємо всі контакти з бази даних
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error); // Логування помилки
    throw new Error(`Error fetching contacts: ${error.message}`); // Більш детальне повідомлення
  }
}
// Сервіс для отримання контакту за ID
export async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId); // Пошук контакту за ID
    return contact;
  } catch (error) {
    console.error(`Error fetching contact with id ${contactId}:`, error);
    throw new Error(`Error fetching contact: ${error.message}`);
  }
}
