import { getInjection } from "@/di/container";
import { Cookie } from "@/src/entities/models/cookie";

export async function signOutUseCase(
  sessionId: string,
): Promise<{ blankCookie: Cookie }> {
  const authenticationService = getInjection("IAuthenticationService");

  return await authenticationService.invalidateSession(sessionId);
}
