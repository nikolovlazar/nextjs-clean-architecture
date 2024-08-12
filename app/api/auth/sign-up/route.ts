import { captureException } from "@sentry/nextjs";
import { cookies } from "next/headers";

import { InputParseError } from "@/src/entities/errors/common";
import { Cookie } from "@/src/entities/models/cookie";
import { signUpController } from "@/src/interface-adapters/controllers/auth/sign-up.controller";

export async function POST(request: Request) {
  const formData = await request.formData();

  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm_password")?.toString();

  let sessionCookie: Cookie;
  try {
    const { cookie } = await signUpController({
      username,
      password,
      confirm_password: confirmPassword,
    });
    sessionCookie = cookie;
  } catch (err) {
    if (err instanceof InputParseError) {
      return Response.json(
        {
          error:
            "Invalid data. Make sure the Password and Confirm Password match.",
        },
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
