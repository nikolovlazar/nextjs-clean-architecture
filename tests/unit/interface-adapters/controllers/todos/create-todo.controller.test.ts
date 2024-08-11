import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di/container";
import { signInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import { InputParseError } from "@/src/entities/errors/common";
import { createTodoController } from "@/src/interface-adapters/controllers/todos/create-todo.controller";
import { UnauthenticatedError } from "@/src/entities/errors/auth";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("creates todo", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  expect(
    createTodoController({ todo: "Test application" }, session.id),
  ).resolves.toMatchObject({
    todo: "Test application",
    completed: false,
    userId: "1",
  });
});

it("throws for invalid input", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  expect(createTodoController({}, session.id)).rejects.toBeInstanceOf(
    InputParseError,
  );

  expect(createTodoController({ todo: "" }, session.id)).rejects.toBeInstanceOf(
    InputParseError,
  );
});

it("throws for unauthenticated", () => {
  expect(
    createTodoController({ todo: "Doesn't matter" }, undefined),
  ).rejects.toBeInstanceOf(UnauthenticatedError);
});
