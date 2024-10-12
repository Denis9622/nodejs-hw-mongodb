import { model, Schema } from 'mongoose';
import { contactTypeList } from './../constants/contacts-constants.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: contactTypeList,
      required: true,
      default: 'personal',
    },
    // Связываем контакт с пользователем через ObjectId
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    photo: {
      type: String,
      default: null, // По умолчанию без фото
    },
  },
  {
    timestamps: true, // Добавляет createdAt и updatedAt
    versionKey: false, // Отключаем поле __v
  },
);

// Хук для обработки ошибок сохранения
contactSchema.post('save', mongooseSaveError);

// Настройки для обновления, чтобы корректно обрабатывать поля
contactSchema.pre('findOneAndUpdate', setUpdateSettings);
contactSchema.post('findOneAndUpdate', mongooseSaveError);

const Contact = model('contacts', contactSchema);
export default Contact;
