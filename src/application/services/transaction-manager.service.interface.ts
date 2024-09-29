export interface ITransaction {
  rollback: () => void;
}

export interface ITransactionManagerService {
  startTransaction<T>(
    clb: (tx: ITransaction) => Promise<T>,
    parent?: ITransaction,
  ): Promise<T>;
}
