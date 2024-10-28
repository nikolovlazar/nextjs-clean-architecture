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

import { DI } from '@/di/container';

export function registerTodosModule(container: Container) {
  if (process.env.NODE_ENV === 'test') {
    container.bind(DI.ITodosRepository).toClass(MockTodosRepository);
  } else {
    container
      .bind(DI.ITodosRepository)
      .toClass(TodosRepository, [
        DI.IInstrumentationService,
        DI.ICrashReporterService,
      ]);
  }

  container
    .bind(DI.ICreateTodoUseCase)
    .toHigherOrderFunction(createTodoUseCase, {
      instrumentationService: DI.IInstrumentationService,
      todosRepository: DI.ITodosRepository,
    });

  container
    .bind(DI.IDeleteTodoUseCase)
    .toHigherOrderFunction(deleteTodoUseCase, {
      instrumentationService: DI.IInstrumentationService,
      todosRepository: DI.ITodosRepository,
    });

  container
    .bind(DI.IGetTodosForUserUseCase)
    .toHigherOrderFunction(getTodosForUserUseCase, {
      instrumentationService: DI.IInstrumentationService,
      todosRepository: DI.ITodosRepository,
    });

  container
    .bind(DI.IToggleTodoUseCase)
    .toHigherOrderFunction(toggleTodoUseCase, {
      instrumentationService: DI.IInstrumentationService,
      todosRepository: DI.ITodosRepository,
    });

  container
    .bind(DI.IBulkUpdateController)
    .toHigherOrderFunction(bulkUpdateController, {
      instrumentationService: DI.IInstrumentationService,
      authenticationService: DI.IAuthenticationService,
      transactionManagerService: DI.ITransactionManagerService,
      toggleTodoUseCase: DI.IToggleTodoUseCase,
      deleteTodoUseCase: DI.IDeleteTodoUseCase,
    });

  container
    .bind(DI.ICreateTodoController)
    .toHigherOrderFunction(createTodoController, {
      instrumentationService: DI.IInstrumentationService,
      authenticationService: DI.IAuthenticationService,
      transactionManagerService: DI.ITransactionManagerService,
      createTodoUseCase: DI.ICreateTodoUseCase,
    });

  container
    .bind(DI.IGetTodosForUserController)
    .toHigherOrderFunction(getTodosForUserController, {
      instrumentationService: DI.IInstrumentationService,
      getTodosForUserUseCase: DI.IGetTodosForUserUseCase,
      authenticationService: DI.IAuthenticationService,
    });

  container
    .bind(DI.IToggleTodoController)
    .toHigherOrderFunction(toggleTodoController, {
      instrumentationService: DI.IInstrumentationService,
      toggleTodoUseCase: DI.IToggleTodoUseCase,
      authenticationService: DI.IAuthenticationService,
    });
}
