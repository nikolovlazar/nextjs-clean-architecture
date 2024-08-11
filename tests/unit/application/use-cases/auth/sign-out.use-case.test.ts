import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di/container";
import { signOutUseCase } from "@/src/application/use-cases/auth/sign-out.use-case";
import { signInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import { SESSION_COOKIE } from "@/config";

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

  expect(signOutUseCase(session.id)).resolves.toMatchObject({
    blankCookie: {
      name: SESSION_COOKIE,
      value: "",
      attributes: {},
    },
  });
});
