import { type ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import { TodosRepository } from '@/src/infrastructure/repositories/todos.repository';
import { MockTodosRepository } from '@/src/infrastructure/repositories/todos.repository.mock';
import { ServiceFactory } from './service-factory';
import { type IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { MockUsersRepository } from '@/src/infrastructure/repositories/users.repository.mock';
import { UsersRepository } from '@/src/infrastructure/repositories/users.repository';

let _todosRepository: ITodosRepository;
let _usersRepository: IUsersRepository;

export class RepositoryFactory {
  static getTodosRepository(): ITodosRepository {
    if (!_todosRepository) {
      _todosRepository = instantiateTodosRepository();
    }
    return _todosRepository;
  }

  static getUsersRepository(): IUsersRepository {
    if (!_usersRepository) {
      _usersRepository = instantiateUsersRepository();
    }
    return _usersRepository;
  }
}

const instantiateTodosRepository = (): ITodosRepository => {
  if (process.env.NODE_ENV === 'test') {
    return new MockTodosRepository();
  }
  return new TodosRepository(
    ServiceFactory.getInstrumentationService(),
    ServiceFactory.getCrashReporterService()
  );
};

const instantiateUsersRepository = (): IUsersRepository => {
  if (process.env.NODE_ENV === 'test') {
    return new MockUsersRepository();
  }
  return new UsersRepository(
    ServiceFactory.getInstrumentationService(),
    ServiceFactory.getCrashReporterService()
  );
};
