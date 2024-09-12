import type { User } from "@/src/entities/models/user";
import { ITransaction } from "@/src/application/services/transaction-manager.service.interface";

export interface IUsersRepository {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(input: User, tx?: ITransaction): Promise<User>;
}
