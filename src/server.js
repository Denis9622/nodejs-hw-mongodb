import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import {
  getContactsController,
  getContactByIdController,
} from './controllers/contactsController.js';


export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());

  app.get('/contacts', getContactsController);
  app.get('/contacts/:contactId', getContactByIdController); // Новий роут для отримання контакту за ID

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
