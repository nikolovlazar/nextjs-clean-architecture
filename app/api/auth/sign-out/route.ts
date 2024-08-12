import { cookies } from "next/headers";
import { captureException } from "@sentry/nextjs";

import { SESSION_COOKIE } from "@/config";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { Cookie } from "@/src/entities/models/cookie";
import { signOutController } from "@/src/interface-adapters/controllers/auth/sign-out.controller";

export async function POST() {
  const cookiesStore = cookies();
  const sessionId = cookiesStore.get(SESSION_COOKIE)?.value;

  let blankCookie: Cookie;
  try {
    blankCookie = await signOutController(sessionId);
  } catch (err) {
    if (err instanceof UnauthenticatedError) {
      return new Response();
    }

    captureException(err);
    throw err;
  }

  cookies().set(blankCookie.name, blankCookie.value, blankCookie.attributes);

  return new Response();
}
