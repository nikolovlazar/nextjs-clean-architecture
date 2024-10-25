import { Container } from 'inversify';

import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { AuthenticationModule } from './modules/authentication.module';
import { DatabaseModule } from './modules/database.module';
import { TodosModule } from './modules/todos.module';
import { UsersModule } from './modules/users.module';
import { MonitoringModule } from './modules/monitoring.module';
import { DI_RETURN_TYPES, DI_SYMBOLS } from './types';

const ApplicationContainer = new Container({
  defaultScope: 'Singleton',
});

export const initializeContainer = () => {
  ApplicationContainer.load(TodosModule);
  ApplicationContainer.load(UsersModule);
  ApplicationContainer.load(AuthenticationModule);
  ApplicationContainer.load(DatabaseModule);
  ApplicationContainer.load(MonitoringModule);
};

export const destroyContainer = () => {
  ApplicationContainer.unload(DatabaseModule);
  ApplicationContainer.unload(AuthenticationModule);
  ApplicationContainer.unload(UsersModule);
  ApplicationContainer.unload(TodosModule);
  ApplicationContainer.unload(MonitoringModule);
};

if (process.env.NODE_ENV !== 'test') {
  initializeContainer();
}

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K
): DI_RETURN_TYPES[K] {
  const instrumentationService =
    ApplicationContainer.get<IInstrumentationService>(
      DI_SYMBOLS.IInstrumentationService
    );

  return instrumentationService.startSpan(
    {
      name: '(di) getInjection',
      op: 'function',
      attributes: { symbol: symbol.toString() },
    },
    () => ApplicationContainer.get(DI_SYMBOLS[symbol])
  );
}

export { ApplicationContainer };
