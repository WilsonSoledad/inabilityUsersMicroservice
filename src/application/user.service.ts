import { UserRepository } from "../domain/user.repository";
import {
  User,
  ReqLoginUser,
  UpdatableUser,
  UserRole,
} from "../domain/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthorizationError } from "./errors/authorization.error";

type Actor = { role: UserRole };

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(actor: Actor, userData: User): Promise<User> {
    if (actor.role !== UserRole.ADMIN) {
      throw new AuthorizationError("No tiene permisos para crear usuarios");
    }

    const hashed = await bcrypt.hash(userData.password, 10);
    const toCreate: User = { ...userData, password: hashed };
    const created = await this.userRepository.create(toCreate);
    return created;
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async update(actor: Actor, id: number, payload: UpdatableUser) {
    if (actor.role !== UserRole.ADMIN) {
      throw new AuthorizationError(
        "No tiene permisos para actualizar usuarios"
      );
    }

    const existing = await this.userRepository.findById(id);
    if (!existing) return null;

    const updatedData: UpdatableUser = { ...payload };

    if (payload.password) {
      const hashed = await bcrypt.hash(payload.password, 10);
      updatedData.password = hashed;
    }

    const updated = await this.userRepository.update(id, updatedData);
    return updated;
  }

  async delete(actor: Actor, id: number) {
    if (actor.role !== UserRole.ADMIN) {
      throw new AuthorizationError("No tiene permisos para eliminar usuarios");
    }

    return this.userRepository.delete(id);
  }

  async login(
    credentials: ReqLoginUser
  ): Promise<{ user: User; token: string } | null> {
    const found = await this.userRepository.findByEmail(credentials.email);
    if (!found) return null;

    const match = await bcrypt.compare(credentials.password, found.password);
    if (!match) return null;

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined. Error in server configuration.');
    }

    const tokenPayload = { id: found.id, role: found.role };
    const token = jwt.sign(tokenPayload, secret, { expiresIn: '1h' });

    return { user: found, token };
    
  }
}