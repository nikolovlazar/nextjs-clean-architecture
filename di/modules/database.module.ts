import { ContainerModule, interfaces } from "inversify";

import { ITransactionManagerService } from "@/src/application/services/transaction-manager.service.interface";
import { TransactionManagerService } from "@/src/infrastructure/services/transaction-manager.service";
import { MockTransactionManagerService } from "@/src/infrastructure/services/transaction-manager.service.mock";
import { DI_SYMBOLS } from "../types";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<ITransactionManagerService>(DI_SYMBOLS.ITransactionManagerService).to(
      MockTransactionManagerService,
    );
  } else {
    bind<ITransactionManagerService>(DI_SYMBOLS.ITransactionManagerService).to(
      TransactionManagerService,
    );
  }
};

export const DatabaseModule = new ContainerModule(initializeModule);
