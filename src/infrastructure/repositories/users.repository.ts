import { db } from "@/drizzle";
import { users } from "@/drizzle/schema";
import { IUsersRepository } from "@/src/application/repositories/users.repository.interface";
import { DatabaseOperationError } from "@/src/entities/errors/common";
import { User } from "@/src/entities/models/user";
import { eq } from "drizzle-orm";
import { injectable } from "inversify";

@injectable()
export class UsersRepository implements IUsersRepository {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      });
      return user;
    } catch (err) {
      throw err;
    }
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.username, username),
      });
      return user;
    } catch (err) {
      throw err;
    }
  }
  async createUser(input: User): Promise<User> {
    try {
      const [created] = await db.insert(users).values(input).returning();
      if (created) {
        return created;
      } else {
        throw new DatabaseOperationError("Cannot create user.");
      }
    } catch (err) {
      throw err;
    }
  }
}
