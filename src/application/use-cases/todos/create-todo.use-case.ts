import { getInjection } from "@/di/container";
import type { Todo } from "@/src/entities/models/todo";

export async function createTodoUseCase(
  input: {
    todo: string;
  },
  userId: string,
): Promise<Todo> {
  const todosRepository = getInjection("ITodosRepository");

  // HINT: this is where you'd do authorization checks - is this user authorized to create a todo
  // for example: free users are allowed only 5 todos, throw an UnauthorizedError if more than 5

  const newTodo = await todosRepository.createTodo({
    todo: input.todo,
    userId,
    completed: false,
  });

  return newTodo;
}
