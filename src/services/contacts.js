import Contact from '../models/contact.js'; // Імпорт моделі контакту

// Сервіс для отримання всіх контактів
export async function getAllContacts() {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error(`Error fetching contacts: ${error.message}`);
  }
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

// Сервіс для створення нового контакту
export async function createContact(contactData) {
  try {
    const newContact = await Contact.create(contactData);
    return newContact;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw new Error('Failed to create contact');
  }
}

// Сервіс для оновлення існуючого контакту за ID
export async function updateContactById(contactId, updateData) {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      updateData,
      { new: true, runValidators: true },
    );
    return updatedContact;
  } catch (error) {
    console.error(`Error updating contact with id ${contactId}:`, error);
    throw new Error(`Failed to update contact: ${error.message}`);
  }
}

// ДОДАНО: Сервіс для видалення контакту за ID
export async function deleteContactById(contactId) {
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact;
  } catch (error) {
    console.error(`Error deleting contact with id ${contactId}:`, error);
    throw new Error(`Failed to delete contact: ${error.message}`);
  }
}
