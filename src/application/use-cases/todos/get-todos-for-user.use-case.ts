import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/di/container";
import type { Todo } from "@/src/entities/models/todo";

export function getTodosForUserUseCase(userId: string): Promise<Todo[]> {
  return startSpan(
    { name: "getTodosForUser UseCase", op: "function" },
    async () => {
      const todosRepository = getInjection("ITodosRepository");

      return await todosRepository.getTodosForUser(userId);
    },
  );
}
