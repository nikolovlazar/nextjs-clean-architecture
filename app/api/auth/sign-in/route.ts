import { captureException } from "@sentry/nextjs";
import { cookies } from "next/headers";

import { AuthenticationError } from "@/src/entities/errors/auth";
import { InputParseError } from "@/src/entities/errors/common";
import { Cookie } from "@/src/entities/models/cookie";
import { signInController } from "@/src/interface-adapters/controllers/auth/sign-in.controller";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  let sessionCookie: Cookie;
  try {
    sessionCookie = await signInController({ username, password });
  } catch (err) {
    if (err instanceof InputParseError || err instanceof AuthenticationError) {
      return Response.json(
        { error: "Incorrect username or password" },
        { status: 400 },
      );
    }

    captureException(err);
    return Response.json(
      {
        error:
          "An error happened. The developers have been notified. Please try again later.",
      },
      { status: 500 },
    );
  }

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return new Response();
}
