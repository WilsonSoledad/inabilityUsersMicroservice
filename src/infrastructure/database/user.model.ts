import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../shared/infrastructure/database/sequelize.config";
import { User, UserRole } from "../../domain/user.entity";

export class UserModel extends Model<User> implements User {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  phone!: string;
  role!: UserRole;
}
UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    firstName: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);
