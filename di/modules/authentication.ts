import { Container } from "@evyweb/ioctopus";

import { AuthenticationService } from "@/src/infrastructure/services/authentication.service";
import { MockAuthenticationService } from "@/src/infrastructure/services/authentication.service.mock";

import { signInController } from "@/src/interface-adapters/controllers/auth/sign-in.controller";
import { signOutController } from "@/src/interface-adapters/controllers/auth/sign-out.controller";
import { signUpController } from "@/src/interface-adapters/controllers/auth/sign-up.controller";

import { DI } from "@/di/types";

export function registerAuthenticationModule(container: Container) {
  if (process.env.NODE_ENV === "test") {
    container
      .bind(DI.IAuthenticationService)
      .toClass(MockAuthenticationService, [DI.IUsersRepository]);
  } else {
    container
      .bind(DI.IAuthenticationService)
      .toClass(AuthenticationService, [
        DI.IUsersRepository,
        DI.IInstrumentationService,
      ]);
  }

  container.bind(DI.ISignInController).toHigherOrderFunction(signInController, {
    instrumentationService: DI.IInstrumentationService,
    signInUseCase: DI.ISignInUseCase,
  });

  container
    .bind(DI.ISignOutController)
    .toHigherOrderFunction(signOutController, {
      instrumentationService: DI.IInstrumentationService,
      authenticationService: DI.IAuthenticationService,
      signOutUseCase: DI.ISignOutUseCase,
    });

  container.bind(DI.ISignUpController).toHigherOrderFunction(signUpController, {
    instrumentationService: DI.IInstrumentationService,
    signUpUseCase: DI.ISignUpUseCase,
  });
}
