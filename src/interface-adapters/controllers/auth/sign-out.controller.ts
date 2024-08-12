import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/di/container";
import { signOutUseCase } from "@/src/application/use-cases/auth/sign-out.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { Cookie } from "@/src/entities/models/cookie";

export async function signOutController(
  sessionId: string | undefined,
): Promise<Cookie> {
  return await startSpan({ name: "signOut Controller" }, async () => {
    if (!sessionId) {
      throw new UnauthenticatedError("Must be logged in to create a todo");
    }
    const authenticationService = getInjection("IAuthenticationService");
    const { session } = await authenticationService.validateSession(sessionId);

    const { blankCookie } = await signOutUseCase(session.id);
    return blankCookie;
  });
}
