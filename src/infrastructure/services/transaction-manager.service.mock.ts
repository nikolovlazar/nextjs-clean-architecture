import { injectable } from "inversify";

import { ITransactionManagerService } from "@/src/application/services/transaction-manager.service.interface";

@injectable()
export class MockTransactionManagerService
  implements ITransactionManagerService
{
  public startTransaction(
    clb: (tx: unknown) => Promise<any>,
  ): Promise<any> | undefined {
    return clb(undefined);
  }
}
