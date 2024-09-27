import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Шлях до .env файлу
const envFilePath = path.resolve(__dirname, './.env');

export function parseEnv() {
  if (!fs.existsSync(envFilePath)) {
    throw new Error('.env file does not exist');
  }

  const envContent = fs.readFileSync(envFilePath, 'utf-8');

  const envVars = {};

  envContent.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });

  return envVars;
}
