import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di/container";
import { signInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import {
  UnauthenticatedError,
  UnauthorizedError,
} from "@/src/entities/errors/auth";
import { createTodoUseCase } from "@/src/application/use-cases/todos/create-todo.use-case";
import { InputParseError } from "@/src/entities/errors/common";
import { signOutUseCase } from "@/src/application/use-cases/auth/sign-out.use-case";
import { bulkUpdateController } from "@/src/interface-adapters/controllers/todos/bulk-update.controller";
import { getTodosForUserController } from "@/src/interface-adapters/controllers/todos/get-todos-for-user.controller";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("bulk updates", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  const todoOne = await createTodoUseCase(
    { todo: "Write unit tests" },
    session.userId,
  );
  const todoTwo = await createTodoUseCase(
    { todo: "Bulk update" },
    session.userId,
  );
  const todoThree = await createTodoUseCase(
    { todo: "Improve DX" },
    session.userId,
  );

  await bulkUpdateController(
    { dirty: [todoTwo.id], deleted: [todoOne.id, todoThree.id] },
    session.id,
  );

  await expect(getTodosForUserController(session.id)).resolves.toMatchObject([
    {
      todo: todoTwo.todo,
      completed: !todoTwo.completed,
      userId: "1",
    },
  ]);
});

it("throws for invalid input", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  // @ts-ignore
  expect(bulkUpdateController(undefined, session.id)).rejects.toBeInstanceOf(
    InputParseError,
  );
  // @ts-ignore
  expect(bulkUpdateController({}, session.id)).rejects.toBeInstanceOf(
    InputParseError,
  );
  expect(
    // @ts-ignore
    bulkUpdateController({ dirty: [] }, session.id),
  ).rejects.toBeInstanceOf(InputParseError);
  expect(
    // @ts-ignore
    bulkUpdateController({ deleted: [] }, session.id),
  ).rejects.toBeInstanceOf(InputParseError);
});

it("throws when unauthenticated", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  const todo = await createTodoUseCase(
    { todo: "Write unit tests" },
    session.userId,
  );

  await signOutUseCase(session.id);

  // with valid session id, but expired session
  expect(
    bulkUpdateController({ dirty: [todo.id], deleted: [] }, session.id),
  ).rejects.toBeInstanceOf(UnauthenticatedError);

  // with undefined session id
  expect(
    bulkUpdateController({ dirty: [todo.id], deleted: [] }, undefined),
  ).rejects.toBeInstanceOf(UnauthenticatedError);
});

it("throws when unauthorized", async () => {
  const { session: sessionOne } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  const todo = await createTodoUseCase(
    { todo: "Write unit tests" },
    sessionOne.userId,
  );

  await signOutUseCase(sessionOne.id);

  const { session: sessionTwo } = await signInUseCase({
    username: "two",
    password: "password-two",
  });

  expect(
    bulkUpdateController({ dirty: [todo.id], deleted: [] }, sessionTwo.id),
  ).rejects.toBeInstanceOf(UnauthorizedError);
});
