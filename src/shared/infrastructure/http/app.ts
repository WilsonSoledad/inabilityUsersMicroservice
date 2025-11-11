import express, { Application } from "express";
import { connectDB } from "../database/sequelize.config";

import { UserService } from "../../../aplication/user.service";
import { SequelizeUserRepository } from "../../../infrastructure/database/sequelize.user.repository";
import { UserController } from "../../../infrastructure/http/user.controller";
import { createUserRouter } from "../../../infrastructure/http/user.router";

export const app: Application = express();

app.use(express.json());

const userRepository = new SequelizeUserRepository();

const userService = new UserService(userRepository);

const userController = new UserController(userService);

const userRouter = createUserRouter(userController);

app.use("/api/v1/users", userRouter);

export const startDatabase = async (): Promise<void> => {
  await connectDB();
};
