import { Cookie } from '@/src/entities/models/cookie';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type ISignOutUseCase = ReturnType<typeof signOutUseCase>;

export const signOutUseCase =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService
  ) =>
  (sessionId: string): Promise<{ blankCookie: Cookie }> => {
    return instrumentationService.startSpan(
      { name: 'signOut Use Case', op: 'function' },
      async () => {
        return await authenticationService.invalidateSession(sessionId);
      }
    );
  };
