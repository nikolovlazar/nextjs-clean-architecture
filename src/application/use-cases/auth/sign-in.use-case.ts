import { verify } from '@node-rs/argon2';

import { AuthenticationError } from '@/src/entities/errors/auth';
import { Cookie } from '@/src/entities/models/cookie';
import { Session } from '@/src/entities/models/session';
import { ServiceFactory } from '@/ioc/service-factory';
import { RepositoryFactory } from '@/ioc/repository-factory';

export function signInUseCase(input: {
  username: string;
  password: string;
}): Promise<{ session: Session; cookie: Cookie }> {
  return ServiceFactory.getInstrumentationService().startSpan(
    { name: 'signIn Use Case', op: 'function' },
    async () => {
      const authenticationService = ServiceFactory.getAuthenticationService();
      const usersRepository = RepositoryFactory.getUsersRepository();

      const existingUser = await usersRepository.getUserByUsername(
        input.username
      );

      if (!existingUser) {
        throw new AuthenticationError('User does not exist');
      }

      const validPassword =
        await ServiceFactory.getInstrumentationService().startSpan(
          { name: 'verify password hash', op: 'function' },
          () =>
            verify(existingUser.password_hash, input.password, {
              memoryCost: 19456,
              timeCost: 2,
              outputLen: 32,
              parallelism: 1,
            })
        );

      if (!validPassword) {
        throw new AuthenticationError('Incorrect username or password');
      }

      return await authenticationService.createSession(existingUser);
    }
  );
}
