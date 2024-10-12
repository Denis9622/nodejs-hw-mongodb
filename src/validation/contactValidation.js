import Joi from 'joi';

import { contactTypeList } from '../constants/contacts-constants.js';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().min(3).max(30).required(),
  email: Joi.string().min(3).max(30),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactTypeList),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  phoneNumber: Joi.string().min(3).max(30),
  email: Joi.string().min(3).max(30),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactTypeList),
});

// // Схема для створення нового контакту
// export const contactSchema = Joi.object({
//   name: Joi.string().min(3).max(20).required(),
//   phoneNumber: Joi.string().min(3).max(20).required(),
//   email: Joi.string().email().optional(),
//   isFavourite: Joi.boolean().optional(),
//   contactType: Joi.string().valid('work', 'home', 'personal').required(),
// });

// // Схема для оновлення контакту
// export const updateContactSchema = Joi.object({
//   name: Joi.string().min(3).max(20).optional(),
//   phoneNumber: Joi.string().min(3).max(20).optional(),
//   email: Joi.string().email().optional(),
//   isFavourite: Joi.boolean().optional(),
//   contactType: Joi.string().valid('work', 'home', 'personal').optional(),
// });
