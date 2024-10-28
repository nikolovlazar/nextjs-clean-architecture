import { hash } from '@node-rs/argon2';

import { AuthenticationError } from '@/src/entities/errors/auth';
import { Cookie } from '@/src/entities/models/cookie';
import { Session } from '@/src/entities/models/session';
import { User } from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';

export type ISignUpUseCase = ReturnType<typeof signUpUseCase>;

export const signUpUseCase =
  ({
    instrumentationService,
    authenticationService,
    usersRepository,
  }: {
    instrumentationService: IInstrumentationService;
    authenticationService: IAuthenticationService;
    usersRepository: IUsersRepository;
  }) =>
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
        const user = await usersRepository.getUserByUsername(input.username);
        if (user) {
          throw new AuthenticationError('Username taken');
        }

        const passwordHash = await instrumentationService.startSpan(
          { name: 'hash password', op: 'function' },
          () =>
            hash(input.password, {
              memoryCost: 19456,
              timeCost: 2,
              outputLen: 32,
              parallelism: 1,
            })
        );

        const userId = authenticationService.generateUserId();

        const newUser = await usersRepository.createUser({
          id: userId,
          username: input.username,
          password_hash: passwordHash,
        });

        const { cookie, session } = await authenticationService.createSession(
          newUser
        );

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
