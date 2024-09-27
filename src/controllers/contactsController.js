import { getAllContacts, getContactById } from '../services/contacts.js'; // Імпорт сервісу

// Контролер для отримання всіх контактів
export async function getContactsController(req, res) {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to retrieve contacts',
      error: error.message,
    });
  }
}

// Контролер для отримання контакту за ID
export async function getContactByIdController(req, res) {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId); // Виклик сервісу для отримання контакту за ID

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to retrieve contact',
      error: error.message,
    });
  }
}
