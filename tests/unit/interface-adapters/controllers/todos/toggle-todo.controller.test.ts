import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di/container";
import { signInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import {
  UnauthenticatedError,
  UnauthorizedError,
} from "@/src/entities/errors/auth";
import { createTodoUseCase } from "@/src/application/use-cases/todos/create-todo.use-case";
import { toggleTodoController } from "@/src/interface-adapters/controllers/todos/toggle-todo.controller";
import { InputParseError } from "@/src/entities/errors/common";
import { signOutUseCase } from "@/src/application/use-cases/auth/sign-out.use-case";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("toggles todo", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  const todo = await createTodoUseCase(
    { todo: "Write unit tests" },
    session.userId,
  );

  expect(todo.completed).toBe(false);

  await expect(
    toggleTodoController({ todoId: todo.id }, session.id),
  ).resolves.toMatchObject({
    todo: "Write unit tests",
    completed: true,
    userId: "1",
  });

  await expect(
    toggleTodoController({ todoId: todo.id }, session.id),
  ).resolves.toMatchObject({
    todo: "Write unit tests",
    completed: false,
    userId: "1",
  });
});

it("throws for invalid input", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  // @ts-ignore
  expect(toggleTodoController(undefined, session.id)).rejects.toBeInstanceOf(
    InputParseError,
  );
  expect(toggleTodoController({}, session.id)).rejects.toBeInstanceOf(
    InputParseError,
  );
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
    toggleTodoController({ todoId: todo.id }, session.id),
  ).rejects.toBeInstanceOf(UnauthenticatedError);

  // with undefined session id
  expect(
    toggleTodoController({ todoId: todo.id }, undefined),
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
    toggleTodoController({ todoId: todo.id }, sessionTwo.id),
  ).rejects.toBeInstanceOf(UnauthorizedError);
});
