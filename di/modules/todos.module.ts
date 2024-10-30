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
    .toHigherOrderFunction(createTodoUseCase, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      todosRepository: DI_SYMBOLS.ITodosRepository,
    });

  container
    .bind(DI_SYMBOLS.IDeleteTodoUseCase)
    .toHigherOrderFunction(deleteTodoUseCase, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      todosRepository: DI_SYMBOLS.ITodosRepository,
    });

  container
    .bind(DI_SYMBOLS.IGetTodosForUserUseCase)
    .toHigherOrderFunction(getTodosForUserUseCase, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      todosRepository: DI_SYMBOLS.ITodosRepository,
    });

  container
    .bind(DI_SYMBOLS.IToggleTodoUseCase)
    .toHigherOrderFunction(toggleTodoUseCase, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      todosRepository: DI_SYMBOLS.ITodosRepository,
    });

  container
    .bind(DI_SYMBOLS.IBulkUpdateController)
    .toHigherOrderFunction(bulkUpdateController, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      authenticationService: DI_SYMBOLS.IAuthenticationService,
      transactionManagerService: DI_SYMBOLS.ITransactionManagerService,
      toggleTodoUseCase: DI_SYMBOLS.IToggleTodoUseCase,
      deleteTodoUseCase: DI_SYMBOLS.IDeleteTodoUseCase,
    });

  container
    .bind(DI_SYMBOLS.ICreateTodoController)
    .toHigherOrderFunction(createTodoController, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      authenticationService: DI_SYMBOLS.IAuthenticationService,
      transactionManagerService: DI_SYMBOLS.ITransactionManagerService,
      createTodoUseCase: DI_SYMBOLS.ICreateTodoUseCase,
    });

  container
    .bind(DI_SYMBOLS.IGetTodosForUserController)
    .toHigherOrderFunction(getTodosForUserController, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      getTodosForUserUseCase: DI_SYMBOLS.IGetTodosForUserUseCase,
      authenticationService: DI_SYMBOLS.IAuthenticationService,
    });

  container
    .bind(DI_SYMBOLS.IToggleTodoController)
    .toHigherOrderFunction(toggleTodoController, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      toggleTodoUseCase: DI_SYMBOLS.IToggleTodoUseCase,
      authenticationService: DI_SYMBOLS.IAuthenticationService,
    });
}
