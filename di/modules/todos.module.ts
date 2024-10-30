import { Container } from '@evyweb/ioctopus';

import { MockTodosRepository } from '@/src/infrastructure/repositories/todos.repository.mock';
import { TodosRepository } from '@/src/infrastructure/repositories/todos.repository';

import { createTodoUseCase } from '@/src/application/use-cases/todos/create-todo.use-case';
import { deleteTodoUseCase } from '@/src/application/use-cases/todos/delete-todo.use-case';
import { getTodosForUserUseCase } from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import { toggleTodoUseCase } from '@/src/application/use-cases/todos/toggle-todo.use-case';

import { bulkUpdateController } from '@/src/interface-adapters/controllers/todos/bulk-update.controller';
import { createTodoController } from '@/src/interface-adapters/controllers/todos/create-todo.controller';
import { getTodosForUserController } from '@/src/interface-adapters/controllers/todos/get-todos-for-user.controller';
import { toggleTodoController } from '@/src/interface-adapters/controllers/todos/toggle-todo.controller';

import { DI_SYMBOLS } from '@/di/types';

export function registerTodosModule(container: Container) {
  if (process.env.NODE_ENV === 'test') {
    container.bind(DI_SYMBOLS.ITodosRepository).toClass(MockTodosRepository);
  } else {
    container
      .bind(DI_SYMBOLS.ITodosRepository)
      .toClass(TodosRepository, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
      ]);
  }

  container
    .bind(DI_SYMBOLS.ICreateTodoUseCase)
    .toHigherOrderFunction(createTodoUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ITodosRepository,
    ]);

  container
    .bind(DI_SYMBOLS.IDeleteTodoUseCase)
    .toHigherOrderFunction(deleteTodoUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ITodosRepository,
    ]);

  container
    .bind(DI_SYMBOLS.IGetTodosForUserUseCase)
    .toHigherOrderFunction(getTodosForUserUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ITodosRepository,
    ]);

  container
    .bind(DI_SYMBOLS.IToggleTodoUseCase)
    .toHigherOrderFunction(toggleTodoUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ITodosRepository,
    ]);

  container
    .bind(DI_SYMBOLS.IBulkUpdateController)
    .toHigherOrderFunction(bulkUpdateController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ITransactionManagerService,
      DI_SYMBOLS.IToggleTodoUseCase,
      DI_SYMBOLS.IDeleteTodoUseCase,
    ]);

  container
    .bind(DI_SYMBOLS.ICreateTodoController)
    .toHigherOrderFunction(createTodoController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ITransactionManagerService,
      DI_SYMBOLS.ICreateTodoUseCase,
    ]);

  container
    .bind(DI_SYMBOLS.IGetTodosForUserController)
    .toHigherOrderFunction(getTodosForUserController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IGetTodosForUserUseCase,
    ]);

  container
    .bind(DI_SYMBOLS.IToggleTodoController)
    .toHigherOrderFunction(toggleTodoController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IToggleTodoUseCase,
    ]);
}
