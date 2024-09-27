import mongoose from 'mongoose';

export async function initMongoConnection() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
    process.env;

  // Екрануємо пароль для безпечного використання в URL
  const encodedPassword = encodeURIComponent(MONGODB_PASSWORD);

  const mongoUri = `mongodb+srv://${MONGODB_USER}:${encodedPassword}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    // Просто підключаємося без додаткових опцій, які тепер не потрібні
    await mongoose.connect(mongoUri);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Завершуємо процес, якщо підключення не вдалося
  }
}
