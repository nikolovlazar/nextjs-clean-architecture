import { hash } from '@node-rs/argon2';

import { AuthenticationError } from '@/src/entities/errors/auth';
import { Cookie } from '@/src/entities/models/cookie';
import { Session } from '@/src/entities/models/session';
import { User } from '@/src/entities/models/user';
import { ServiceFactory } from '@/ioc/service-factory';
import { RepositoryFactory } from '@/ioc/repository-factory';
export function signUpUseCase(input: {
  username: string;
  password: string;
}): Promise<{
  session: Session;
  cookie: Cookie;
  user: Pick<User, 'id' | 'username'>;
}> {
  return ServiceFactory.getInstrumentationService().startSpan(
    { name: 'signUp Use Case', op: 'function' },
    async () => {
      const usersRepository = RepositoryFactory.getUsersRepository();
      const user = await usersRepository.getUserByUsername(input.username);
      if (user) {
        throw new AuthenticationError('Username taken');
      }

      const passwordHash =
        await ServiceFactory.getInstrumentationService().startSpan(
          { name: 'hash password', op: 'function' },
          () =>
            hash(input.password, {
              memoryCost: 19456,
              timeCost: 2,
              outputLen: 32,
              parallelism: 1,
            })
        );

      const authenticationService = ServiceFactory.getAuthenticationService();
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
}
