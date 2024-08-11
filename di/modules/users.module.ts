import { ContainerModule, interfaces } from "inversify";

import { UsersRepository } from "@/src/infrastructure/repositories/users.repository";
import { IUsersRepository } from "@/src/application/repositories/users.repository.interface";
import { MockUsersRepository } from "@/src/infrastructure/repositories/users.repository.mock";

import { DI_SYMBOLS } from "../types";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IUsersRepository>(DI_SYMBOLS.IUsersRepository).to(MockUsersRepository);
  } else {
    bind<IUsersRepository>(DI_SYMBOLS.IUsersRepository).to(UsersRepository);
  }
};

export const UsersModule = new ContainerModule(initializeModule);
