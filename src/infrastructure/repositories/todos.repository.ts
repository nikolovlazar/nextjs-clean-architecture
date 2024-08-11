import { db } from "@/drizzle";
import { todos } from "@/drizzle/schema";
import { ITodosRepository } from "@/src/application/repositories/todos.repository.interface";
import { DatabaseOperationError } from "@/src/entities/errors/common";
import { TodoInsert, Todo } from "@/src/entities/models/todo";
import { eq } from "drizzle-orm";
import { injectable } from "inversify";

@injectable()
export class TodosRepository implements ITodosRepository {
  async createTodo(todo: TodoInsert): Promise<Todo> {
    try {
      const [created] = await db.insert(todos).values(todo).returning();
      if (created) {
        return created;
      } else {
        throw new DatabaseOperationError("Cannot create todo");
      }
    } catch (err) {
      throw err;
    }
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    try {
      const todo = await db.query.todos.findFirst({
        where: eq(todos.id, id),
      });
      return todo;
    } catch (err) {
      throw err;
    }
  }

  async getTodosForUser(userId: string): Promise<Todo[]> {
    try {
      const usersTodos = await db.query.todos.findMany({
        where: eq(todos.userId, userId),
      });
      return usersTodos;
    } catch (err) {
      throw err;
    }
  }

  async updateTodo(id: number, input: Partial<TodoInsert>): Promise<Todo> {
    try {
      const [updated] = await db
        .update(todos)
        .set(input)
        .where(eq(todos.id, id))
        .returning();
      return updated;
    } catch (err) {
      throw err;
    }
  }
}
