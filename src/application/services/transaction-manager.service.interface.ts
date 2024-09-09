interface ITransaction {
  rollback: () => void;
}

export interface ITransactionManagerService {
  startTransaction<T>(
    clb: (tx: ITransaction) => Promise<T>,
  ): Promise<T> | undefined;
}
