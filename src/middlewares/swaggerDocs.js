import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { SWAGGER_PATH } from '../constants/contacts-constants.js';

export function swaggerDocs() {
  return (req, res, next) => {
    try {
      const swaggerDocument = JSON.parse(
        fs.readFileSync(SWAGGER_PATH, 'utf-8'),
      );
      return swaggerUi.setup(swaggerDocument)(req, res, next);
    } catch (error) {
      console.error('Failed to read Swagger document:', error);
      res.status(500).json({
        status: 500,
        message: 'Failed to load Swagger documentation',
      });
    }
  };
}

export const swaggerServe = swaggerUi.serve;
