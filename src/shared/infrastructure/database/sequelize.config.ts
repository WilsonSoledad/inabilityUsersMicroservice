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
  dialect: "mysql",
  logging: false,
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Connection to MySQL correctly established");
    await sequelize.sync({ alter: true });
    console.log("Models syncronized to database");
  } catch (error) {
    console.error("could not connect to database: ", error);
    process.exit(1);
  }
};
