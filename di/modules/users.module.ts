import { Container } from '@evyweb/ioctopus';

import { MockUsersRepository } from '@/src/infrastructure/repositories/users.repository.mock';
import { UsersRepository } from '@/src/infrastructure/repositories/users.repository';

import { signInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { signUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { signOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';

import { DI_SYMBOLS } from '@/di/types';

export function registerUsersModule(container: Container) {
  if (process.env.NODE_ENV === 'test') {
    container.bind(DI_SYMBOLS.IUsersRepository).toClass(MockUsersRepository);
  } else {
    container
      .bind(DI_SYMBOLS.IUsersRepository)
      .toClass(UsersRepository, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
      ]);
  }

  container
    .bind(DI_SYMBOLS.ISignInUseCase)
    .toHigherOrderFunction(signInUseCase, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      authenticationService: DI_SYMBOLS.IAuthenticationService,
      usersRepository: DI_SYMBOLS.IUsersRepository,
    });

  container
    .bind(DI_SYMBOLS.ISignOutUseCase)
    .toHigherOrderFunction(signOutUseCase, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      authenticationService: DI_SYMBOLS.IAuthenticationService,
    });

  container
    .bind(DI_SYMBOLS.ISignUpUseCase)
    .toHigherOrderFunction(signUpUseCase, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      authenticationService: DI_SYMBOLS.IAuthenticationService,
      usersRepository: DI_SYMBOLS.IUsersRepository,
    });
}
