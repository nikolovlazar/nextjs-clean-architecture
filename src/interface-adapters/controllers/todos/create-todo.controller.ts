import { z } from 'zod';

import { ICreateTodoUseCase } from '@/src/application/use-cases/todos/create-todo.use-case';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { Todo } from '@/src/entities/models/todo';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';

function presenter(
  todos: Todo[],
  instrumentationService: IInstrumentationService
) {
  return instrumentationService.startSpan(
    { name: 'createTodo Presenter', op: 'serialize' },
    () => {
      return todos.map((todo) => ({
        id: todo.id,
        todo: todo.todo,
        userId: todo.userId,
        completed: todo.completed,
      }));
    }
  );
}

const inputSchema = z.object({ todo: z.string().min(1) });

export type ICreateTodoController = ReturnType<typeof createTodoController>;

export const createTodoController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    transactionManagerService: ITransactionManagerService,
    createTodoUseCase: ICreateTodoUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    sessionId: string | undefined
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      {
        name: 'createTodo Controller',
      },
      async () => {
        if (!sessionId) {
          throw new UnauthenticatedError('Must be logged in to create a todo');
        }
        const { user } = await authenticationService.validateSession(sessionId);

        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        const todosFromInput = data.todo.split(',').map((t) => t.trim());

        const todos = await instrumentationService.startSpan(
          { name: 'Create Todo Transaction' },
          async () =>
            transactionManagerService.startTransaction(async (tx) => {
              try {
                return await Promise.all(
                  todosFromInput.map((t) =>
                    createTodoUseCase({ todo: t }, user.id, tx)
                  )
                );
              } catch (err) {
                console.error('Rolling back!');
                tx.rollback();
              }
            })
        );
        return presenter(todos ?? [], instrumentationService);
      }
    );
  };
