import { Request, Response, NextFunction } from "express";
import { UserService } from "../../application/user.service";
import { CreateUserDto } from "../../application/dtos/create-user.dto";
import { UpdateUserDto } from "../../application/dtos/update-user.dto";
import { LoginUserDto } from "../../application/dtos/login-user.dto";
import { AuthRequest } from "../../shared/infrastructure/http/auth.middleware";
import { AuthorizationError } from "../../application/errors/authorization.error";
import { User } from "../../domain/user.entity";
import ResponseHandler from "../../shared/utils/response-handler";
import { asyncHandler } from "../../shared/middleware/error-handler";

export class UserController {
  constructor(private readonly userService: UserService) {}

  private toUserResponse(user: User): Omit<User, "password"> {
    const { password, ...userResponse } = user;
    return userResponse;
  }

  public create = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const actor = req.user;
    if (!actor) {
      ResponseHandler.unauthorized(res, "Identidad del solicitante desconocida");
      return;
    }

    const dto = req.body as CreateUserDto;
    const user = await this.userService.createUser({ role: actor.role }, dto);

    ResponseHandler.success(res, this.toUserResponse(user), "Usuario creado exitosamente", 201);
  });

  public getAll = asyncHandler(async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const users = await this.userService.getAll();
    const usersResponse = users.map(user => this.toUserResponse(user));

    ResponseHandler.success(res, usersResponse, `Se encontraron ${users.length} usuarios`);
  });

  public getById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      ResponseHandler.badRequest(res, "ID inválido");
      return;
    }

    const user = await this.userService.getById(id);

    if (!user) {
      ResponseHandler.notFound(res, "Usuario");
      return;
    }

    ResponseHandler.success(res, this.toUserResponse(user), "Usuario encontrado");
  });

  public update = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const actor = req.user;
    if (!actor) {
      ResponseHandler.unauthorized(res, "Identidad del solicitante desconocida");
      return;
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      ResponseHandler.badRequest(res, "ID inválido");
      return;
    }

    const dto = req.body as UpdateUserDto;
    const user = await this.userService.update({ role: actor.role }, id, dto);

    if (!user) {
      ResponseHandler.notFound(res, "Usuario");
      return;
    }

    ResponseHandler.success(res, this.toUserResponse(user), "Usuario actualizado exitosamente");
  });

  public delete = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const actor = req.user;
    if (!actor) {
      ResponseHandler.unauthorized(res, "Identidad del solicitante desconocida");
      return;
    }

    const id = Number(req.params.id);
    if (isNaN(id)) {
      ResponseHandler.badRequest(res, "ID inválido");
      return;
    }

    const success = await this.userService.delete({ role: actor.role }, id);

    if (!success) {
      ResponseHandler.notFound(res, "Usuario");
      return;
    }

    res.status(204).send();
  });

  public login = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = req.body as LoginUserDto;
    const result = await this.userService.login(dto);

    if (!result) {
      ResponseHandler.unauthorized(res, "Email o contraseña incorrectos");
      return;
    }

    ResponseHandler.success(
      res,
      {
        user: this.toUserResponse(result.user),
        token: result.token,
      },
      "Inicio de sesión exitoso"
    );
  });
}