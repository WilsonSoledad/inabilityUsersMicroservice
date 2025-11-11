export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

export type UpdatableUser = Partial<Omit<User, "id">>;

export type ReqLoginUser = Pick<User, "email" | "password">;
