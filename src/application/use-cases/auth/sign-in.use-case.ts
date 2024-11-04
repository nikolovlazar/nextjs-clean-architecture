import { AuthenticationError } from '@/src/entities/errors/auth';
import { Cookie } from '@/src/entities/models/cookie';
import { Session } from '@/src/entities/models/session';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type ISignInUseCase = ReturnType<typeof signInUseCase>;

export const signInUseCase =
  (
    instrumentationService: IInstrumentationService,
    usersRepository: IUsersRepository,
    authenticationService: IAuthenticationService
  ) =>
  (input: {
    username: string;
    password: string;
  }): Promise<{ session: Session; cookie: Cookie }> => {
    return instrumentationService.startSpan(
      { name: 'signIn Use Case', op: 'function' },
      async () => {
        const existingUser = await usersRepository.getUserByUsername(
          input.username
        );

        if (!existingUser) {
          throw new AuthenticationError('User does not exist');
        }

        const validPassword = await authenticationService.validatePasswords(
          input.password,
          existingUser.password_hash
        );

        if (!validPassword) {
          throw new AuthenticationError('Incorrect username or password');
        }

        return await authenticationService.createSession(existingUser);
      }
    );
  };
