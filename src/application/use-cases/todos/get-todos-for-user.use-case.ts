import type { Todo } from '@/src/entities/models/todo';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';

export type IGetTodosForUserUseCase = ReturnType<typeof getTodosForUserUseCase>;

export const getTodosForUserUseCase =
  (
    instrumentationService: IInstrumentationService,
    todosRepository: ITodosRepository
  ) =>
  (userId: string): Promise<Todo[]> => {
    return instrumentationService.startSpan(
      { name: 'getTodosForUser UseCase', op: 'function' },
      async () => {
        return await todosRepository.getTodosForUser(userId);
      }
    );
  };
