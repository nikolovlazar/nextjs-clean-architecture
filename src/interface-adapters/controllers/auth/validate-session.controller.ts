import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { InputParseError } from '@/src/entities/errors/common';

export type IValidateSessionController = ReturnType<
  typeof validateSessionController
>;

export const validateSessionController =
  ({
    instrumentationService,
    authenticationService,
  }: {
    instrumentationService: IInstrumentationService;
    authenticationService: IAuthenticationService;
  }) =>
  async (sessionId: string | undefined) => {
    if (!sessionId) {
      throw new InputParseError('Must provide a session ID');
    }
    return await instrumentationService.startSpan(
      { name: 'validateSessionController' },
      async () => {
        return await authenticationService.validateSession(sessionId);
      }
    );
  };
