import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di/container";
import { signInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { createTodoUseCase } from "@/src/application/use-cases/todos/create-todo.use-case";
import { getTodosForUserController } from "@/src/interface-adapters/controllers/todos/get-todos-for-user.controller";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("returns users todos", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  await expect(getTodosForUserController(session.id)).resolves.toMatchObject(
    [],
  );

  await createTodoUseCase({ todo: "todo-one" }, session.userId);
  await createTodoUseCase({ todo: "todo-two" }, session.userId);
  await createTodoUseCase({ todo: "todo-three" }, session.userId);

  await expect(getTodosForUserController(session.id)).resolves.toMatchObject([
    {
      todo: "todo-one",
      completed: false,
      userId: "1",
    },
    {
      todo: "todo-two",
      completed: false,
      userId: "1",
    },
    {
      todo: "todo-three",
      completed: false,
      userId: "1",
    },
  ]);
});

it("throws when unauthenticated", () => {
  expect(getTodosForUserController("")).rejects.toBeInstanceOf(
    UnauthenticatedError,
  );
  expect(getTodosForUserController(undefined)).rejects.toBeInstanceOf(
    UnauthenticatedError,
  );
});
