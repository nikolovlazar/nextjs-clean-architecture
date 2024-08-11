import { ContainerModule, interfaces } from "inversify";

import { ITodosRepository } from "@/src/application/repositories/todos.repository.interface";
import { TodosRepository } from "@/src/infrastructure/repositories/todos.repository";
import { MockTodosRepository } from "@/src/infrastructure/repositories/todos.repository.mock";

import { DI_SYMBOLS } from "../types";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<ITodosRepository>(DI_SYMBOLS.ITodosRepository).to(MockTodosRepository);
  } else {
    bind<ITodosRepository>(DI_SYMBOLS.ITodosRepository).to(TodosRepository);
  }
};

export const TodosModule = new ContainerModule(initializeModule);
