import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di/container";
import { signInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import { createTodoUseCase } from "@/src/application/use-cases/todos/create-todo.use-case";
import { signOutUseCase } from "@/src/application/use-cases/auth/sign-out.use-case";
import { UnauthorizedError } from "@/src/entities/errors/auth";
import { NotFoundError } from "@/src/entities/errors/common";
import { deleteTodoUseCase } from "@/src/application/use-cases/todos/delete-todo.use-case";
import { getTodosForUserUseCase } from "@/src/application/use-cases/todos/get-todos-for-user.use-case";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("deletes todo", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  const todo = await createTodoUseCase(
    { todo: "Write unit tests" },
    session.userId,
  );

  // Deletion returns the deleted object
  await expect(
    deleteTodoUseCase({ todoId: todo.id }, session.userId),
  ).resolves.toMatchObject({
    todo: "Write unit tests",
    userId: "1",
  });

  // Todos should be empty at this point
  await expect(getTodosForUserUseCase(session.userId)).resolves.toMatchObject(
    [],
  );
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
    deleteTodoUseCase({ todoId: todo.id }, sessionTwo.userId),
  ).rejects.toBeInstanceOf(UnauthorizedError);
});

it("throws for invalid input", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  expect(
    deleteTodoUseCase({ todoId: 1234567890 }, session.userId),
  ).rejects.toBeInstanceOf(NotFoundError);
});
