import { injectable } from "inversify";

import { db, Transaction } from "@/drizzle";
import { ITransactionManagerService } from "@/src/application/services/transaction-manager.service.interface";

@injectable()
export class TransactionManagerService implements ITransactionManagerService {
  public startTransaction(
    clb: (tx: Transaction) => Promise<any>,
  ): Promise<any> | undefined {
    return db.transaction(clb);
  }
}
