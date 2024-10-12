import multer from 'multer';
import path from 'path';
import { TEMP_UPLOAD_DIR } from '../constants/contacts-constants.js';

// Создаем хранилище для временного хранения загруженных файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_UPLOAD_DIR); // Указываем директорию для временного хранения файлов
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${file.originalname}`; // Создаем уникальное имя файла
    cb(null, uniqueSuffix);
  },
});

// Функция для фильтрации файлов (например, проверка типа)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/; // Допустимые форматы файлов
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Если формат верен, принимаем файл
  } else {
    cb(
      new Error(
        'Unsupported file format. Only JPEG, JPG, and PNG are allowed.',
      ),
      false,
    ); // Если формат неверный, ошибка
  }
};

// Ограничиваем размер файла (например, до 5 МБ)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

// Создаем middleware для загрузки с использованием настроек
export const upload = multer({
  storage, // Настройки хранилища
  fileFilter, // Фильтрация файлов по типу
  limits, // Ограничения на размер файла
});
