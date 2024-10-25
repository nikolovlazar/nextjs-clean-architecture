import { getInjection } from '@/di/container';
import { Cookie } from '@/src/entities/models/cookie';

export function signOutUseCase(
  sessionId: string
): Promise<{ blankCookie: Cookie }> {
  const instrumentationService = getInjection('IInstrumentationService');
  return instrumentationService.startSpan(
    { name: 'signOut Use Case', op: 'function' },
    async () => {
      const authenticationService = getInjection('IAuthenticationService');

      return await authenticationService.invalidateSession(sessionId);
    }
  );
}
