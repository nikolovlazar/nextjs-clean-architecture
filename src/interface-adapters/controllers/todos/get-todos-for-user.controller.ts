import { getInjection } from "@/di/container";
import { getTodosForUserUseCase } from "@/src/application/use-cases/todos/get-todos-for-user.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { Todo } from "@/src/entities/models/todo";

function presenter(todos: Todo[]) {
  return todos.map((t) => ({
    id: t.id,
    todo: t.todo,
    userId: t.userId,
    completed: t.completed,
  }));
}

export async function getTodosForUserController(
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  if (!sessionId) {
    throw new UnauthenticatedError("Must be logged in to create a todo");
  }

  const authenticationService = getInjection("IAuthenticationService");
  const { session } = await authenticationService.validateSession(sessionId);

  const todos = await getTodosForUserUseCase(session.userId);

  return presenter(todos);
}
