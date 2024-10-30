import { Container } from '@evyweb/ioctopus';

import { MockUsersRepository } from '@/src/infrastructure/repositories/users.repository.mock';
import { UsersRepository } from '@/src/infrastructure/repositories/users.repository';

import { signInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { signUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { signOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';

import { DI } from '@/di/types';

export function registerUsersModule(container: Container) {
  if (process.env.NODE_ENV === 'test') {
    container.bind(DI.IUsersRepository).toClass(MockUsersRepository);
  } else {
    container
      .bind(DI.IUsersRepository)
      .toClass(UsersRepository, [
        DI.IInstrumentationService,
        DI.ICrashReporterService,
      ]);
  }

  container.bind(DI.ISignInUseCase).toHigherOrderFunction(signInUseCase, {
    instrumentationService: DI.IInstrumentationService,
    authenticationService: DI.IAuthenticationService,
    usersRepository: DI.IUsersRepository,
  });

  container.bind(DI.ISignOutUseCase).toHigherOrderFunction(signOutUseCase, {
    instrumentationService: DI.IInstrumentationService,
    authenticationService: DI.IAuthenticationService,
  });

  container.bind(DI.ISignUpUseCase).toHigherOrderFunction(signUpUseCase, {
    instrumentationService: DI.IInstrumentationService,
    authenticationService: DI.IAuthenticationService,
    usersRepository: DI.IUsersRepository,
  });
}
