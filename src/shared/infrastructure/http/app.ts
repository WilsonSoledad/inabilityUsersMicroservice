import express, { Application } from "express";
import { connectDB, sequelize } from "../database/sequelize.config";
import { errorHandler, notFoundHandler } from "../../middleware/error-handler";

import { UserService } from "../../../application/user.service";
import { SequelizeUserRepository } from "../../../infrastructure/database/sequelize.user.repository";
import { UserController } from "../../../infrastructure/http/user.controller";
import { createUserRouter } from "../../../infrastructure/http/user.router";

export const app: Application = express();

app.use(express.json());

const userRepository = new SequelizeUserRepository();

const userService = new UserService(userRepository);

const userController = new UserController(userService);

const userRouter = createUserRouter(userController);

app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ 
      status: "ok", 
      message: "UsersService running",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: "error", 
      message: "UsersService unhealthy",
      database: "disconnected",
      timestamp: new Date().toISOString()
    });
  }
});

app.use("/api/users", userRouter);

// Error handlers (deben ir al final)
app.use(notFoundHandler);
app.use(errorHandler);

export const startDatabase = async (): Promise<void> => {
  await connectDB();
};
