import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/di/container";
import { UnauthorizedError } from "@/src/entities/errors/auth";
import { NotFoundError } from "@/src/entities/errors/common";
import type { Todo } from "@/src/entities/models/todo";
import { ITransaction } from "@/src/application/services/transaction-manager.service.interface";

export function deleteTodoUseCase(
  input: {
    todoId: number;
  },
  userId: string,
  tx?: ITransaction,
): Promise<Todo> {
  return startSpan(
    { name: "deleteTodo Use Case", op: "function" },
    async () => {
      const todosRepository = getInjection("ITodosRepository");

      const todo = await todosRepository.getTodo(input.todoId);

      if (!todo) {
        throw new NotFoundError("Todo does not exist");
      }

      if (todo.userId !== userId) {
        throw new UnauthorizedError("Cannot delete todo. Reason: unauthorized");
      }

      await todosRepository.deleteTodo(todo.id, tx);

      return todo;
    },
  );
}
