import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di/container";
import { signInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import { createTodoUseCase } from "@/src/application/use-cases/todos/create-todo.use-case";
import { toggleTodoUseCase } from "@/src/application/use-cases/todos/toggle-todo.use-case";
import { signOutUseCase } from "@/src/application/use-cases/auth/sign-out.use-case";
import { UnauthorizedError } from "@/src/entities/errors/auth";
import { NotFoundError } from "@/src/entities/errors/common";

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

  expect(
    toggleTodoUseCase({ todoId: todo.id }, session.userId),
  ).resolves.toMatchObject({
    todo: "Write unit tests",
    userId: "1",
    completed: true,
  });
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
    toggleTodoUseCase({ todoId: todo.id }, sessionTwo.userId),
  ).rejects.toBeInstanceOf(UnauthorizedError);
});

it("throws for invalid input", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  expect(
    toggleTodoUseCase({ todoId: 1234567890 }, session.userId),
  ).rejects.toBeInstanceOf(NotFoundError);
});
