import { AuthenticationError } from '@/src/entities/errors/auth';
import { Cookie } from '@/src/entities/models/cookie';
import { Session } from '@/src/entities/models/session';
import { User } from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';

export type ISignUpUseCase = ReturnType<typeof signUpUseCase>;

export const signUpUseCase =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    usersRepository: IUsersRepository
  ) =>
  (input: {
    username: string;
    password: string;
  }): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, 'id' | 'username'>;
  }> => {
    return instrumentationService.startSpan(
      { name: 'signUp Use Case', op: 'function' },
      async () => {
        const existingUser = await usersRepository.getUserByUsername(
          input.username
        );
        if (existingUser) {
          throw new AuthenticationError('Username taken');
        }

        const userId = authenticationService.generateUserId();

        const newUser = await usersRepository.createUser({
          id: userId,
          username: input.username,
          password: input.password,
        });

        const { cookie, session } =
          await authenticationService.createSession(newUser);

        return {
          cookie,
          session,
          user: {
            id: newUser.id,
            username: newUser.username,
          },
        };
      }
    );
  };
