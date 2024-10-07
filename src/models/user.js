// src/models/user.js
import mongoose from 'mongoose';

// Схема для моделі User
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'], // Обязательное поле
    },
    email: {
      type: String,
      required: [true, 'Email is required'], // Обязательное поле
      unique: true, // Email должен быть уникальным
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], // Валидация email
    },
    password: {
      type: String,
      required: [true, 'Password is required'], // Обязательное поле
    },
  },
  {
    timestamps: true, // Автоматически добавляет поля createdAt и updatedAt
  },
);

// Создаем модель User
const User = mongoose.model('User', userSchema);

export default User;
