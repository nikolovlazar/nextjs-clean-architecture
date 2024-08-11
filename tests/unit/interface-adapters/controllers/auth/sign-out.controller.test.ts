import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { SESSION_COOKIE } from "@/config";
import { destroyContainer, initializeContainer } from "@/di/container";
import { signInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import { InputParseError } from "@/src/entities/errors/common";
import { signOutController } from "@/src/interface-adapters/controllers/auth/sign-out.controller";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("returns blank cookie", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  expect(signOutController(session.id)).resolves.toMatchObject({
    name: SESSION_COOKIE,
    value: "",
    attributes: {},
  });
});

it("throws for invalid input", () => {
  expect(signOutController(undefined)).rejects.toBeInstanceOf(InputParseError);
});
