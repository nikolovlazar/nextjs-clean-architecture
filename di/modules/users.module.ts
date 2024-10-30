import { Container } from '@evyweb/ioctopus';

import { MockUsersRepository } from '@/src/infrastructure/repositories/users.repository.mock';
import { UsersRepository } from '@/src/infrastructure/repositories/users.repository';

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
}
