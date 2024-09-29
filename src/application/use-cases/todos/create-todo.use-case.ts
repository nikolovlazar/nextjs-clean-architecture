import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/di/container";
import { InputParseError } from "@/src/entities/errors/common";
import type { Todo } from "@/src/entities/models/todo";

export function createTodoUseCase(
  input: {
    todo: string;
  },
  userId: string,
  tx?: any,
): Promise<Todo> {
  return startSpan(
    { name: "createTodo Use Case", op: "function" },
    async () => {
      const todosRepository = getInjection("ITodosRepository");

      // HINT: this is where you'd do authorization checks - is this user authorized to create a todo
      // for example: free users are allowed only 5 todos, throw an UnauthorizedError if more than 5

      if (input.todo.length < 4) {
        throw new InputParseError("Todo must be at least 4 chars");
      }

      const newTodo = await todosRepository.createTodo(
        {
          todo: input.todo,
          userId,
          completed: false,
        },
        tx,
      );

      return newTodo;
    },
  );
}
