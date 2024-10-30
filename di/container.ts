import { Container, createContainer } from "@evyweb/ioctopus";

import { registerMonitoringModule } from "@/di/modules/monitoring";
import { registerAuthenticationModule } from "@/di/modules/authentication";
import { registerTransactionManagerModule } from "@/di/modules/transaction-manager";
import { registerTodosModule } from "@/di/modules/todos";
import { registerUsersModule } from "@/di/modules/users";
import { DI_TYPES, DI } from "@/di/types";

const container: Container = createContainer();

registerMonitoringModule(container);
registerTransactionManagerModule(container);
registerAuthenticationModule(container);
registerUsersModule(container);
registerTodosModule(container);

export function resolveDependency<T extends keyof DI_TYPES>(
  key: T,
): DI_TYPES[T] {
  return container.get<DI_TYPES[T]>(DI[key]);
}
