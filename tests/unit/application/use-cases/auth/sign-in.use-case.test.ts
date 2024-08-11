import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di/container";
import { signInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import { AuthenticationError } from "@/src/entities/errors/auth";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("returns session and cookie", async () => {
  const result = await signInUseCase({
    username: "one",
    password: "password-one",
  });
  expect(result).toHaveProperty("session");
  expect(result).toHaveProperty("cookie");
  expect(result.session.userId).toBe("1");
});

it("throws for invalid input", () => {
  expect(() =>
    signInUseCase({ username: "non-existing", password: "doesntmatter" }),
  ).rejects.toBeInstanceOf(AuthenticationError);

  expect(() =>
    signInUseCase({ username: "one", password: "password-two" }),
  ).rejects.toBeInstanceOf(AuthenticationError);
});
