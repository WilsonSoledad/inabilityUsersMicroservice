import { UpdatableUser, User } from "./user.entity";

export interface UserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  update(id: number, payload: UpdatableUser): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}
