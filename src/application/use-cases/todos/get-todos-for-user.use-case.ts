import { getInjection } from "@/di/container";
import type { Todo } from "@/src/entities/models/todo";

export async function getTodosForUserUseCase(userId: string): Promise<Todo[]> {
  const todosRepository = getInjection("ITodosRepository");

  return await todosRepository.getTodosForUser(userId);
}
