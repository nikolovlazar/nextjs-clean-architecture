import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di/container";
import { signInController } from "@/src/interface-adapters/controllers/auth/sign-in.controller";
import { SESSION_COOKIE } from "@/config";
import { InputParseError } from "@/src/entities/errors/common";
import { AuthenticationError } from "@/src/entities/errors/auth";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("signs in with valid input", () => {
  expect(
    signInController({ username: "one", password: "password-one" }),
  ).resolves.toMatchObject({
    name: SESSION_COOKIE,
    value: "random_session_id_1",
    attributes: {},
  });
});

it("throws for invalid input", () => {
  expect(signInController({ username: "" })).rejects.toBeInstanceOf(
    InputParseError,
  );
  expect(signInController({ password: "" })).rejects.toBeInstanceOf(
    InputParseError,
  );
  expect(signInController({ username: "no" })).rejects.toBeInstanceOf(
    InputParseError,
  );
  expect(signInController({ password: "no" })).rejects.toBeInstanceOf(
    InputParseError,
  );
  expect(
    signInController({ username: "one", password: "short" }),
  ).rejects.toBeInstanceOf(InputParseError);
  expect(
    signInController({
      username: "oneverylongusernamethatmakesnosense",
      password: "short",
    }),
  ).rejects.toBeInstanceOf(InputParseError);
  expect(
    signInController({
      username: "one",
      password: "oneverylongpasswordthatmakesnosense",
    }),
  ).rejects.toBeInstanceOf(InputParseError);
  expect(
    signInController({
      username: "oneverylongusernamethatmakesnosense",
      password: "oneverylongpasswordthatmakesnosense",
    }),
  ).rejects.toBeInstanceOf(InputParseError);
});

it("throws for invalid credentials", async () => {
  await expect(
    signInController({ username: "nonexisting", password: "doesntmatter" }),
  ).rejects.toBeInstanceOf(AuthenticationError);
  expect(
    signInController({ username: "one", password: "wrongpass" }),
  ).rejects.toBeInstanceOf(AuthenticationError);
});
