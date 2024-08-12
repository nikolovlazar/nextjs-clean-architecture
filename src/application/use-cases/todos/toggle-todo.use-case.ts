import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/di/container";
import { UnauthorizedError } from "@/src/entities/errors/auth";
import { NotFoundError } from "@/src/entities/errors/common";
import type { Todo } from "@/src/entities/models/todo";

export function toggleTodoUseCase(
  input: {
    todoId: number;
  },
  userId: string,
): Promise<Todo> {
  return startSpan(
    { name: "toggleTodo Use Case", op: "function" },
    async () => {
      const todosRepository = getInjection("ITodosRepository");

      const todo = await todosRepository.getTodo(input.todoId);

      if (!todo) {
        throw new NotFoundError("Todo does not exist");
      }

      if (todo.userId !== userId) {
        throw new UnauthorizedError("Cannot toggle todo. Reason: unauthorized");
      }

      const updatedTodo = await todosRepository.updateTodo(todo.id, {
        completed: !todo.completed,
      });

      return updatedTodo;
    },
  );
}
