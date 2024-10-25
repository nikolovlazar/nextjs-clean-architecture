import { Cookie } from '@/src/entities/models/cookie';
import { ServiceFactory } from '@/ioc/service-factory';

export function signOutUseCase(
  sessionId: string
): Promise<{ blankCookie: Cookie }> {
  return ServiceFactory.getInstrumentationService().startSpan(
    { name: 'signOut Use Case', op: 'function' },
    async () => {
      const authenticationService = ServiceFactory.getAuthenticationService();

      return await authenticationService.invalidateSession(sessionId);
    }
  );
}
