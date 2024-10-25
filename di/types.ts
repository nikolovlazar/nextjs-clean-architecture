import { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),
  ITransactionManagerService: Symbol.for('ITransactionManagerService'),
  IInstrumentationService: Symbol.for('IInstrumentationService'),
  ICrashReporterService: Symbol.for('ICrashReporterService'),

  // Repositories
  ITodosRepository: Symbol.for('ITodosRepository'),
  IUsersRepository: Symbol.for('IUsersRepository'),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;
  ITransactionManagerService: ITransactionManagerService;
  IInstrumentationService: IInstrumentationService;
  ICrashReporterService: ICrashReporterService;
  // Repositories
  ITodosRepository: ITodosRepository;
  IUsersRepository: IUsersRepository;
}
