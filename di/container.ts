import { Container, createContainer } from '@evyweb/ioctopus';

import { registerMonitoringModule } from '@/di/modules/monitoring.module';
import { registerAuthenticationModule } from '@/di/modules/authentication.module';
import { registerTransactionManagerModule } from '@/di/modules/database.module';
import { registerTodosModule } from '@/di/modules/todos.module';
import { registerUsersModule } from '@/di/modules/users.module';
import { DI_TYPES, DI } from '@/di/types';

const container: Container = createContainer();

registerMonitoringModule(container);
registerTransactionManagerModule(container);
registerAuthenticationModule(container);
registerUsersModule(container);
registerTodosModule(container);

export function getInjection<T extends keyof DI_TYPES>(key: T): DI_TYPES[T] {
  return container.get<DI_TYPES[T]>(DI[key]);
}
