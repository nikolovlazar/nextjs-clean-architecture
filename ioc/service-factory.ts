import { type IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { type ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import { type IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { type ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import { AuthenticationService } from '@/src/infrastructure/services/authentication.service';
import { MockAuthenticationService } from '@/src/infrastructure/services/authentication.service.mock';
import { CrashReporterService } from '@/src/infrastructure/services/crash-reporter.service';
import { MockCrashReporterService } from '@/src/infrastructure/services/crash-reporter.service.mock';
import { InstrumentationService } from '@/src/infrastructure/services/instrumentation.service';
import { MockInstrumentationService } from '@/src/infrastructure/services/instrumentation.service.mock';
import { TransactionManagerService } from '@/src/infrastructure/services/transaction-manager.service';
import { MockTransactionManagerService } from '@/src/infrastructure/services/transaction-manager.service.mock';

import { RepositoryFactory } from './repository-factory';

let _authenticationService: IAuthenticationService;
let _instrumentationService: IInstrumentationService;
let _crashReporterService: ICrashReporterService;
let _transactionManagerService: ITransactionManagerService;

export class ServiceFactory {
  static getAuthenticationService(): IAuthenticationService {
    if (!_authenticationService) {
      _authenticationService = instantiateAuthenticationService();
    }
    return _authenticationService;
  }

  static getInstrumentationService(): IInstrumentationService {
    if (!_instrumentationService) {
      _instrumentationService = instantiateInstrumentationService();
    }
    return _instrumentationService;
  }

  static getCrashReporterService(): ICrashReporterService {
    if (!_crashReporterService) {
      _crashReporterService = instantiateCrashReporterService();
    }
    return _crashReporterService;
  }

  static getTransactionManagerService(): ITransactionManagerService {
    if (!_transactionManagerService) {
      _transactionManagerService = instantiateTransactionManagerService();
    }
    return _transactionManagerService;
  }
}

const instantiateInstrumentationService = (): IInstrumentationService => {
  if (process.env.NODE_ENV === 'test') {
    return new MockInstrumentationService();
  }
  return new InstrumentationService();
};

const instantiateCrashReporterService = (): ICrashReporterService => {
  if (process.env.NODE_ENV === 'test') {
    return new MockCrashReporterService();
  }
  return new CrashReporterService();
};

const instantiateTransactionManagerService = (): ITransactionManagerService => {
  if (process.env.NODE_ENV === 'test') {
    return new MockTransactionManagerService();
  }
  return new TransactionManagerService();
};

const instantiateAuthenticationService = (): IAuthenticationService => {
  if (process.env.NODE_ENV === 'test') {
    return new MockAuthenticationService(
      RepositoryFactory.getUsersRepository()
    );
  }
  return new AuthenticationService(
    RepositoryFactory.getUsersRepository(),
    ServiceFactory.getInstrumentationService()
  );
};
