import { createContainer } from '@evyweb/ioctopus';

import { DI_RETURN_TYPES, DI_SYMBOLS } from '@/di/types';

import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

import { registerMonitoringModule } from '@/di/modules/monitoring.module';
import { registerAuthenticationModule } from '@/di/modules/authentication.module';
import { registerTransactionManagerModule } from '@/di/modules/database.module';
import { registerTodosModule } from '@/di/modules/todos.module';
import { registerUsersModule } from '@/di/modules/users.module';

const ApplicationContainer = createContainer();

registerMonitoringModule(ApplicationContainer);
registerTransactionManagerModule(ApplicationContainer);
registerAuthenticationModule(ApplicationContainer);
registerUsersModule(ApplicationContainer);
registerTodosModule(ApplicationContainer);

export function getInjection<T extends keyof DI_RETURN_TYPES>(
  key: T
): DI_RETURN_TYPES[T] {
  const instrumentationService =
    ApplicationContainer.get<IInstrumentationService>(
      DI_SYMBOLS.IInstrumentationService
    );

  return instrumentationService.startSpan(
    {
      name: '(di) getInjection',
      op: 'function',
      attributes: { symbol: key.toString() },
    },
    () => ApplicationContainer.get<DI_RETURN_TYPES[T]>(DI_SYMBOLS[key])
  );
}
