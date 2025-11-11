import { User, UpdatableUser } from "../../domain/user.entity";
import { UserRepository } from "../../domain/user.repository";
import { UserModel } from "./user.model";

export class SequelizeUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const userModel = await UserModel.create(user);
    return userModel.toJSON() as User;
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.findAll();
    return users.map((user) => user.toJSON() as User);
  }

  async findById(id: number): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    return user ? (user.toJSON() as User) : null;
  }

  async update(id: number, payload: UpdatableUser): Promise<User | null> {
    const [affectedCount] = await UserModel.update(payload, {
      where: { id },
    });
    if (affectedCount === 0) {
      return null;
    }
    return this.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ where: { email } });
    return user ? (user.toJSON() as User) : null;
  }
  async delete(id: number): Promise<boolean> {
    const affectedCount = await UserModel.destroy({
      where: { id },
    });
    return affectedCount > 0;
  }
}
