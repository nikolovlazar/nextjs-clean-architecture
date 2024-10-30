import type { Todo, TodoInsert } from '@/src/entities/models/todo';

export interface ITodosRepository {
  createTodo(todo: TodoInsert, tx?: any): Promise<Todo>;
  getTodo(id: number): Promise<Todo | undefined>;
  getTodosForUser(userId: string): Promise<Todo[]>;
  updateTodo(id: number, input: Partial<TodoInsert>, tx?: any): Promise<Todo>;
  deleteTodo(id: number, tx?: any): Promise<void>;
}
