import { Request, Response } from "express";
import { UserService } from "../../aplication/user.service";
import { CreateUserDto } from "../../aplication/dtos/create-user.dto";
import { UpdateUserDto } from "../../aplication/dtos/update-user.dto";
import { LoginUserDto } from "../../aplication/dtos/login-user.dto";
import { AuthRequest } from "../../shared/infrastructure/http/auth.middleware";
import { AuthorizationError } from "../../aplication/errors/authorization.error";
import { User } from "../../domain/user.entity";

export class UserController {
  constructor(private readonly userService: UserService) {}

  private toUserResponse(user: User): Omit<User, "password"> {
    const { password, ...userResponse } = user;
    return userResponse;
  }

  public create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const actor = req.user;
      if (!actor) {
        res
          .status(401)
          .json({ message: "applicant identity is unknown." });
        return;
      }

      const dto = req.body as CreateUserDto;
      const user = await this.userService.createUser({ role: actor.role }, dto);

      res.status(201).json(this.toUserResponse(user));

    } catch (error) {
      if (error instanceof AuthorizationError) {
        res.status(403).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  };

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAll();

      const usersResponse = users.map(user => this.toUserResponse(user));

      res.status(200).json(usersResponse);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "invalid ID" });
        return;
      }

      const user = await this.userService.getById(id);

      if (user) {
        res.status(200).json(this.toUserResponse(user));
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  public update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const actor = req.user;
      if (!actor) {
        res
          .status(401)
          .json({ message: " applicant identity is unknown." });
        return;
      }

      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "invalid ID" });
        return;
      }

      const dto = req.body as UpdateUserDto;
      const user = await this.userService.update({ role: actor.role }, id, dto);

      if (user) {
        res.status(200).json(this.toUserResponse(user));
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      if (error instanceof AuthorizationError) {
        res.status(403).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  };

  public delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const actor = req.user;
      if (!actor) {
        res
          .status(401)
          .json({ message: "applicant identity is unknown." });
        return;
      }

      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "invalid Id" });
        return;
      }

      const success = await this.userService.delete({ role: actor.role }, id);

      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      if (error instanceof AuthorizationError) {
        res.status(403).json({ message: error.message });
      } else {
        res.status(500).json({ message: (error as Error).message });
      }
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto = req.body as LoginUserDto;
      const result = await this.userService.login(dto);

      if (result) {
        res.status(200).json({
          message: "successfull login",
          user: this.toUserResponse(result.user),
          token: result.token,
        });
      } else {
        res.status(401).json({ message: "wrong Email or password" });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };
}