import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/di/container";
import type { Todo } from "@/src/entities/models/todo";
import { TODOS_PER_PAGE } from "@/config";

export function getTodosForUserUseCase(
  page: number,
  userId: string,
): Promise<{ todos: Todo[]; pages: number }> {
  return startSpan(
    { name: "getTodosForUser UseCase", op: "function" },
    async () => {
      const todosRepository = getInjection("ITodosRepository");

      const { todos, count } = await todosRepository.getTodosForUser(
        page,
        userId,
      );
      const pages = Math.ceil(count / TODOS_PER_PAGE);
      return { todos, pages };
    },
  );
}
