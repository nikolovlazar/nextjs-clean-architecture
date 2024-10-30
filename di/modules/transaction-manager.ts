import { Container } from "@evyweb/ioctopus";

import { TransactionManagerService } from "@/src/infrastructure/services/transaction-manager.service";
import { MockTransactionManagerService } from "@/src/infrastructure/services/transaction-manager.service.mock";

import { DI } from "@/di/types";

export function registerTransactionManagerModule(container: Container) {
  if (process.env.NODE_ENV === "test") {
    container
      .bind(DI.ITransactionManagerService)
      .toClass(MockTransactionManagerService);
  } else {
    container
      .bind(DI.ITransactionManagerService)
      .toClass(TransactionManagerService);
  }
}
