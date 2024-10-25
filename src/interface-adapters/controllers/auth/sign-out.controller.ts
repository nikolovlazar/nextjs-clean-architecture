import { getInjection } from '@/di/container';
import { signOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';
import { Cookie } from '@/src/entities/models/cookie';
import { InputParseError } from '@/src/entities/errors/common';

export async function signOutController(
  sessionId: string | undefined
): Promise<Cookie> {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.startSpan(
    { name: 'signOut Controller' },
    async () => {
      if (!sessionId) {
        throw new InputParseError('Must provide a session ID');
      }
      const authenticationService = getInjection('IAuthenticationService');
      const { session } = await authenticationService.validateSession(
        sessionId
      );

      const { blankCookie } = await signOutUseCase(session.id);
      return blankCookie;
    }
  );
}
