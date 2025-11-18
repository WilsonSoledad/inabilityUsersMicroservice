import * as dotenv from 'dotenv';

dotenv.config();

interface EnvironmentConfig {
  DB_HOST: string;
  DB_PORT: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  PORT: string;
  NODE_ENV: string;
  JWT_SECRET: string;
}

function validateEnvironmentVariables(): EnvironmentConfig {
  const requiredVars = [
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'PORT',
    'NODE_ENV',
    'JWT_SECRET',
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Variables de entorno faltantes: ${missing.join(', ')}\n` +
      `Por favor configura estas variables en tu archivo .env`
    );
  }

  return {
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: process.env.DB_PORT!,
    DB_NAME: process.env.DB_NAME!,
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    PORT: process.env.PORT!,
    NODE_ENV: process.env.NODE_ENV!,
    JWT_SECRET: process.env.JWT_SECRET!,
  };
}

export const env = validateEnvironmentVariables();

console.log('✅ Variables de entorno validadas correctamente');
