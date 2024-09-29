import { injectable } from "inversify";

import {
  ITransaction,
  ITransactionManagerService,
} from "@/src/application/services/transaction-manager.service.interface";

@injectable()
export class MockTransactionManagerService
  implements ITransactionManagerService
{
  public startTransaction<T>(
    clb: (tx: ITransaction) => Promise<T>,
  ): Promise<T> {
    return clb({ rollback: () => {} });
  }
}
