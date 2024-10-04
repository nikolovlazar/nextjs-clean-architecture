import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/di/container";
import { getTodosForUserUseCase } from "@/src/application/use-cases/todos/get-todos-for-user.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { Todo } from "@/src/entities/models/todo";

function presenter(todos: Todo[], pages: number) {
  return startSpan(
    { name: "getTodosForUser Presenter", op: "serialize" },
    () => ({
      todos: todos.map((t) => ({
        id: t.id,
        todo: t.todo,
        userId: t.userId,
        completed: t.completed,
      })),
      pages,
    }),
  );
}

export async function getTodosForUserController(
  page: number,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan({ name: "getTodosForUser Controller" }, async () => {
    if (!sessionId) {
      throw new UnauthenticatedError("Must be logged in to create a todo");
    }

    const authenticationService = getInjection("IAuthenticationService");
    const { session } = await authenticationService.validateSession(sessionId);

    const { todos, pages } = await getTodosForUserUseCase(page, session.userId);

    return presenter(todos, pages);
  });
}
