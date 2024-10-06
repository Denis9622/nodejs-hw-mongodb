import {
  getContactById,
  getAllContactsWithPagination,
} from '../services/contacts.js'; // Імпорт сервісу

// Контролер для отримання всіх контактів з сортуванням, пагінацією та фільтрацією по полю isFavourite
export async function getContactsController(req, res, next) {
  try {
    // Отримуємо параметри з запиту (query params)
    const page = parseInt(req.query.page, 10) || 1; // Номер сторінки, за замовчуванням 1
    const perPage = parseInt(req.query.perPage, 10) || 10; // Кількість елементів на сторінці, за замовчуванням 10
    const sortBy = req.query.sortBy || 'name'; // Поле для сортування, за замовчуванням 'name'
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Порядок сортування (-1 для desc, 1 для asc)

    // Додаємо можливість фільтрації по полю isFavourite
    const filter = {}; // Об'єкт для фільтрації

    // Перетворюємо параметр isFavourite з рядка у логічне значення
    if (req.query.isFavourite !== undefined) {
      filter.isFavourite = req.query.isFavourite === 'true'; // Преобразование строки в булево значение
    }

    // Виклик сервісу для отримання контактів з пагінацією, сортуванням і фільтрацією
    const { contacts, totalItems } = await getAllContactsWithPagination(
      page,
      perPage,
      sortBy,
      sortOrder,
      filter // Передаємо фільтр у сервіс
    );

    const totalPages = Math.ceil(totalItems / perPage); // Вираховуємо загальну кількість сторінок

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
    next(error); // Передаємо помилку далі в middleware для обробки
  }
}


// Контролер для отримання контакту за ID
export async function getContactByIdController(req, res) {
  try {
    const { contactId } = req.params; // Отримуємо contactId з параметрів запиту
    const contact = await getContactById(contactId); // Виклик сервісу для отримання контакту за ID

    if (!contact) {
      // Якщо контакт не знайдений, повертаємо статус 404
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    // Успішна відповідь з контактними даними
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    // Якщо сталася помилка, повертаємо статус 500 і повідомлення про помилку
    res.status(500).json({
      status: 500,
      message: 'Failed to retrieve contact',
      error: error.message,
    });
  }
}
