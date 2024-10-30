import { IGetTodosForUserUseCase } from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { Todo } from '@/src/entities/models/todo';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

function presenter(
  todos: Todo[],
  instrumentationService: IInstrumentationService
) {
  return instrumentationService.startSpan(
    { name: 'getTodosForUser Presenter', op: 'serialize' },
    () =>
      todos.map((t) => ({
        id: t.id,
        todo: t.todo,
        userId: t.userId,
        completed: t.completed,
      }))
  );
}

export type IGetTodosForUserController = ReturnType<
  typeof getTodosForUserController
>;

export const getTodosForUserController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    getTodosForUserUseCase: IGetTodosForUserUseCase
  ) =>
  async (
    sessionId: string | undefined
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      { name: 'getTodosForUser Controller' },
      async () => {
        if (!sessionId) {
          throw new UnauthenticatedError('Must be logged in to create a todo');
        }

        const { session } =
          await authenticationService.validateSession(sessionId);

        const todos = await getTodosForUserUseCase(session.userId);

        return presenter(todos, instrumentationService);
      }
    );
  };
