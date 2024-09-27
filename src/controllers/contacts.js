import { getAllContacts } from '../services/contacts.js'; // Імпорт сервісу

export async function getAllContactsController(req, res) {
  try {
    const contacts = await getAllContacts(); // Викликаємо сервіс для отримання контактів
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error fetching contacts',
      error: error.message,
    });
  }
}
