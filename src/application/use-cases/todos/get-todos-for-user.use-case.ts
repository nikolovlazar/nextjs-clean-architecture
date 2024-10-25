import type { Todo } from '@/src/entities/models/todo';
import { ServiceFactory } from '@/ioc/service-factory';
import { RepositoryFactory } from '@/ioc/repository-factory';

export function getTodosForUserUseCase(userId: string): Promise<Todo[]> {
  return ServiceFactory.getInstrumentationService().startSpan(
    { name: 'getTodosForUser UseCase', op: 'function' },
    async () => {
      const todosRepository = RepositoryFactory.getTodosRepository();

      return await todosRepository.getTodosForUser(userId);
    }
  );
}
