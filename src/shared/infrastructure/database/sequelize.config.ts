import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
  throw new Error("Environment variables are missing for the database");
}

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  dialect: "postgres",
  logging: false,
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ UsersService conectado a PostgreSQL");
    
    // Importar UserModel para sincronizar solo este modelo
    const { UserModel } = await import('../../../infrastructure/database/user.model');
    
    if (process.env.NODE_ENV === 'development') {
      await UserModel.sync({ alter: true });
      console.log("✅ Tabla 'users' sincronizada");
    }
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error);
    process.exit(1);
  }
};
