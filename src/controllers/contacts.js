import mongoose from 'mongoose';

import createHttpError from 'http-errors';
import {
  getAllContactsWithPagination,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';
import { env } from './../env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

// Контроллер для получения всех контактов с пагинацией и сортировкой
export async function getContactsController(req, res, next) {
  try {
    if (!req.user || !req.user._id) {
      throw createHttpError(401, 'Authentication required');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const { contacts, totalItems } = await getAllContactsWithPagination(
      page,
      perPage,
      sortBy,
      sortOrder,
      { userId: req.user._id },
    );

    const totalPages = Math.ceil(totalItems / perPage);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Контроллер для получения контакта по ID
export async function getContactByIdController(req, res, next) {
  try {
    const userId = req.user._id;
    const { contactId } = req.params;

    const contact = await getContactById(contactId, userId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
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

// Контроллер для создания нового контакта
export const createContactController = async (req, res, next) => {
  try {
    const photo = req.file;
    let photoUrl;

    if (photo) {
      if (env('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    const userId = req.user._id;
    if (!userId) {
      throw createHttpError(400, 'User ID is required');
    }

    const contactData = {
      ...req.body,
      userId,
      photo: photoUrl,
    };

    const newContact = await createContact(contactData);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// Контроллер для обновления контакта
export async function updateContactController(req, res, next) {
  try {
    const userId = req.user._id.toString();
    const { contactId } = req.params;

    let updateData = { ...req.body };

    if (req.file) {
      const photoUrl = await saveFileToCloudinary(req.file);
      updateData.photo = photoUrl;
    }

    const updatedContact = await updateContactById(
      contactId,
      userId,
      updateData,
    );

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
}

// Контроллер для удаления контакта
export async function deleteContactController(req, res, next) {
  try {
    const userId = req.user._id;
    const { contactId } = req.params;

    const deletedContact = await deleteContactById(contactId, userId);

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    // Проверяем валидность идентификаторов
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(400, 'Invalid contact ID format');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid user ID format');
    }

    // Логируем, чтобы отследить данные
    console.log('Contact ID:', contactId);
    console.log('User ID:', userId);

    // Получаем файл из запроса (если он есть)
    const photo = req.file;
    let photoUrl;

    // Если есть фото, сохраняем его либо в Cloudinary, либо локально
    if (photo) {
      if (env('ENABLE_CLOUDINARY', 'false') === 'true') {
        photoUrl = await saveFileToCloudinary(photo); // Сохраняем файл в Cloudinary
      } else {
        photoUrl = await saveFileToUploadDir(photo); // Сохраняем файл локально
      }
    }

    // Обновление контакта с возможным новым фото
    const updateData = {
      ...req.body,
      photo: photoUrl, // Если фото не было загружено, это значение будет undefined и поле не обновится
    };

    const result = await updateContactById(contactId, userId, updateData);

    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched the contact!',
      data: result,
    });
  } catch (error) {
    console.error('Error in patchContactController:', error);
    next(error);
  }
};
