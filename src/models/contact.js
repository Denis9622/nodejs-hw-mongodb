import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    email: {
      type: String,
      default: '',
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: [true, 'Contact type is required'],
      default: 'personal',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Связываем с коллекцией User
      required: true, // Поле userId обязательно
    },
  },
  {
    timestamps: true, // Додає createdAt та updatedAt автоматично
  },
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
