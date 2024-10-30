import { UnauthorizedError } from '@/src/entities/errors/auth';
import { NotFoundError } from '@/src/entities/errors/common';
import type { Todo } from '@/src/entities/models/todo';
import type { ITransaction } from '@/src/entities/models/transaction.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';

export type IDeleteTodoUseCase = ReturnType<typeof deleteTodoUseCase>;

export const deleteTodoUseCase =
  (
    instrumentationService: IInstrumentationService,
    todosRepository: ITodosRepository
  ) =>
  (
    input: {
      todoId: number;
    },
    userId: string,
    tx?: ITransaction
  ): Promise<Todo> => {
    return instrumentationService.startSpan(
      { name: 'deleteTodo Use Case', op: 'function' },
      async () => {
        const todo = await todosRepository.getTodo(input.todoId);

        if (!todo) {
          throw new NotFoundError('Todo does not exist');
        }

        if (todo.userId !== userId) {
          throw new UnauthorizedError(
            'Cannot delete todo. Reason: unauthorized'
          );
        }

        await todosRepository.deleteTodo(todo.id, tx);

        return todo;
      }
    );
  };
