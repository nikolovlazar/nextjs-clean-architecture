import { Container } from '@evyweb/ioctopus';

import { AuthenticationService } from '@/src/infrastructure/services/authentication.service';
import { MockAuthenticationService } from '@/src/infrastructure/services/authentication.service.mock';

import { signInController } from '@/src/interface-adapters/controllers/auth/sign-in.controller';
import { signOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';
import { signUpController } from '@/src/interface-adapters/controllers/auth/sign-up.controller';

import { DI_SYMBOLS } from '@/di/types';

export function registerAuthenticationModule(container: Container) {
  if (process.env.NODE_ENV === 'test') {
    container
      .bind(DI_SYMBOLS.IAuthenticationService)
      .toClass(MockAuthenticationService, [DI_SYMBOLS.IUsersRepository]);
  } else {
    container
      .bind(DI_SYMBOLS.IAuthenticationService)
      .toClass(AuthenticationService, [
        DI_SYMBOLS.IUsersRepository,
        DI_SYMBOLS.IInstrumentationService,
      ]);
  }

  container
    .bind(DI_SYMBOLS.ISignInController)
    .toHigherOrderFunction(signInController, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      signInUseCase: DI_SYMBOLS.ISignInUseCase,
    });

  container
    .bind(DI_SYMBOLS.ISignOutController)
    .toHigherOrderFunction(signOutController, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      authenticationService: DI_SYMBOLS.IAuthenticationService,
      signOutUseCase: DI_SYMBOLS.ISignOutUseCase,
    });

  container
    .bind(DI_SYMBOLS.ISignUpController)
    .toHigherOrderFunction(signUpController, {
      instrumentationService: DI_SYMBOLS.IInstrumentationService,
      signUpUseCase: DI_SYMBOLS.ISignUpUseCase,
    });
}
