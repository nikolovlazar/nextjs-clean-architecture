import { z } from 'zod';

import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import { IToggleTodoUseCase } from '@/src/application/use-cases/todos/toggle-todo.use-case';
import { IDeleteTodoUseCase } from '@/src/application/use-cases/todos/delete-todo.use-case';

const inputSchema = z.object({
  dirty: z.array(z.number()),
  deleted: z.array(z.number()),
});

export type IBulkUpdateController = ReturnType<typeof bulkUpdateController>;

export const bulkUpdateController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    transactionManagerService: ITransactionManagerService,
    toggleTodoUseCase: IToggleTodoUseCase,
    deleteTodoUseCase: IDeleteTodoUseCase
  ) =>
  async (
    input: z.infer<typeof inputSchema>,
    sessionId: string | undefined
  ): Promise<void> => {
    return await instrumentationService.startSpan(
      {
        name: 'bulkUpdate Controller',
      },
      async () => {
        if (!sessionId) {
          throw new UnauthenticatedError(
            'Must be logged in to bulk update todos'
          );
        }
        const { user } = await authenticationService.validateSession(sessionId);

        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        const { dirty, deleted } = data;

        await instrumentationService.startSpan(
          { name: 'Bulk Update Transaction' },
          async () => {
            await transactionManagerService.startTransaction(async (mainTx) => {
              try {
                await Promise.all(
                  dirty.map((t) =>
                    toggleTodoUseCase({ todoId: t }, user.id, mainTx)
                  )
                );
              } catch (err) {
                console.error(err);
                console.error('Rolling back toggles!');
                mainTx.rollback();
              }

              // Create a savepoint to avoid rolling back toggles if deletes fail
              await transactionManagerService.startTransaction(
                async (deleteTx) => {
                  try {
                    await Promise.all(
                      deleted.map((t) =>
                        deleteTodoUseCase({ todoId: t }, user.id, deleteTx)
                      )
                    );
                  } catch (err) {
                    console.error('Rolling back deletes!');
                    deleteTx.rollback();
                  }
                },
                mainTx
              );
            });
          }
        );
      }
    );
  };
