import { count, eq } from "drizzle-orm";
import { injectable } from "inversify";
import { startSpan, captureException } from "@sentry/nextjs";

import { db, Transaction } from "@/drizzle";
import { todos } from "@/drizzle/schema";
import { ITodosRepository } from "@/src/application/repositories/todos.repository.interface";
import { DatabaseOperationError } from "@/src/entities/errors/common";
import { TodoInsert, Todo } from "@/src/entities/models/todo";
import { TODOS_PER_PAGE } from "@/config";

@injectable()
export class TodosRepository implements ITodosRepository {
  async createTodo(todo: TodoInsert, tx?: Transaction): Promise<Todo> {
    const invoker = tx ?? db;

    return await startSpan(
      { name: "TodosRepository > createTodo" },
      async () => {
        try {
          const query = invoker.insert(todos).values(todo).returning();

          const [created] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => query.execute(),
          );

          if (created) {
            return created;
          } else {
            throw new DatabaseOperationError("Cannot create todo");
          }
        } catch (err) {
          captureException(err, { data: todo });
          throw err; // TODO: convert to Entities error
        }
      },
    );
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    return await startSpan({ name: "TodosRepository > getTodo" }, async () => {
      try {
        const query = db.query.todos.findFirst({
          where: eq(todos.id, id),
        });

        const todo = await startSpan(
          {
            name: query.toSQL().sql,
            op: "db.query",
            attributes: { "db.system": "sqlite" },
          },
          () => query.execute(),
        );

        return todo;
      } catch (err) {
        captureException(err);
        throw err; // TODO: convert to Entities error
      }
    });
  }

  async getTodosForUser(
    page: number,
    userId: string,
  ): Promise<{ todos: Todo[]; count: number }> {
    return await startSpan(
      { name: "TodosRepository > getTodosForUser" },
      async () => {
        try {
          const countQuery = db
            .select({
              count: count(),
            })
            .from(todos)
            .where(eq(todos.userId, userId))
            .$dynamic();

          const countPromise = startSpan(
            {
              name: countQuery.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => countQuery.execute(),
          );

          const todosQuery = db.query.todos.findMany({
            where: eq(todos.userId, userId),
            offset: (page - 1) * TODOS_PER_PAGE,
            limit: TODOS_PER_PAGE,
          });

          const todosPromise = startSpan(
            {
              name: todosQuery.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => todosQuery.execute(),
          );
          const [todosCount, usersTodos] = await Promise.all([
            countPromise,
            todosPromise,
          ]);
          return { todos: usersTodos, count: todosCount[0].count };
        } catch (err) {
          captureException(err);
          throw err; // TODO: convert to Entities error
        }
      },
    );
  }

  async updateTodo(id: number, input: Partial<TodoInsert>): Promise<Todo> {
    return await startSpan(
      { name: "TodosRepository > updateTodo" },
      async () => {
        try {
          const query = db
            .update(todos)
            .set(input)
            .where(eq(todos.id, id))
            .returning();

          const [updated] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => query.execute(),
          );
          return updated;
        } catch (err) {
          captureException(err);
          throw err; // TODO: convert to Entities error
        }
      },
    );
  }

  async deleteTodo(id: number, tx?: Transaction): Promise<void> {
    const invoker = tx ?? db;

    await startSpan({ name: "TodosRepository > deleteTodo" }, async () => {
      try {
        const query = invoker.delete(todos).where(eq(todos.id, id)).returning();

        await startSpan(
          {
            name: query.toSQL().sql,
            op: "db.query",
            attributes: { "db.system": "sqlite" },
          },
          () => query.execute(),
        );
      } catch (err) {
        captureException(err);
        throw err; // TODO: convert to Entities error
      }
    });
  }
}
