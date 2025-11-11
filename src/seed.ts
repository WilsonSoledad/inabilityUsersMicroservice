import { connectDB } from "./shared/infrastructure/database/sequelize.config";
import { UserModel } from "./infrastructure/database/user.model";
import { UserRole } from "./domain/user.entity";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";


dotenv.config();

const createAdminUser = async () => {
  try {

    await connectDB();
    const adminEmail = "admin@example.com";
    const adminPassword = "mypassword123";

    const existingAdmin = await UserModel.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = {
      id: 1002394315,
      firstName: "Admin",
      lastName: "User",
      email: adminEmail,
      password: hashedPassword,
      phone: "123456789",
      role: UserRole.ADMIN,
    };

    await UserModel.create(adminUser);

  } catch (error) {
    console.error("Error during the seed script", error);
    process.exit(1);
  } finally {
    console.log("closing connection to database.");

    process.exit(0);
  }
};


createAdminUser();