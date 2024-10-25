import { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import { Todo, TodoInsert } from '@/src/entities/models/todo';

export class MockTodosRepository implements ITodosRepository {
  private _todos: Todo[];

  constructor() {
    this._todos = [];
  }

  async createTodo(todo: TodoInsert): Promise<Todo> {
    const id = this._todos.length;
    const created = { ...todo, id };
    this._todos.push(created);
    return created;
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    const todo = this._todos.find((t) => t.id === id);
    return todo;
  }

  async getTodosForUser(userId: string): Promise<Todo[]> {
    const usersTodos = this._todos.filter((t) => t.userId === userId);
    return usersTodos;
  }

  async updateTodo(id: number, input: Partial<TodoInsert>): Promise<Todo> {
    const existingIndex = this._todos.findIndex((t) => t.id === id);
    const updated = {
      ...this._todos[existingIndex],
      ...input,
    };
    this._todos[existingIndex] = updated;
    return updated;
  }

  async deleteTodo(id: number): Promise<void> {
    const existingIndex = this._todos.findIndex((t) => t.id === id);
    if (existingIndex > -1) {
      delete this._todos[existingIndex];
      this._todos = this._todos.filter(Boolean);
    }
  }
}
