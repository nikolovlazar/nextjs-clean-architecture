import { UnauthorizedError } from '@/src/entities/errors/auth';
import { NotFoundError } from '@/src/entities/errors/common';
import type { Todo } from '@/src/entities/models/todo';
import type { ITransaction } from '@/src/entities/models/transaction.interface';
import { ServiceFactory } from '@/ioc/service-factory';
import { RepositoryFactory } from '@/ioc/repository-factory';

export function deleteTodoUseCase(
  input: {
    todoId: number;
  },
  userId: string,
  tx?: ITransaction
): Promise<Todo> {
  return ServiceFactory.getInstrumentationService().startSpan(
    { name: 'deleteTodo Use Case', op: 'function' },
    async () => {
      const todosRepository = RepositoryFactory.getTodosRepository();

      const todo = await todosRepository.getTodo(input.todoId);

      if (!todo) {
        throw new NotFoundError('Todo does not exist');
      }

      if (todo.userId !== userId) {
        throw new UnauthorizedError('Cannot delete todo. Reason: unauthorized');
      }

      await todosRepository.deleteTodo(todo.id, tx);

      return todo;
    }
  );
}
