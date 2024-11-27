import { createModule } from '@evyweb/ioctopus';

import { MockUsersRepository } from '@/src/infrastructure/repositories/users.repository.mock';
import { UsersRepository } from '@/src/infrastructure/repositories/users.repository';

import { DI_SYMBOLS } from '@/di/types';

export function createUsersModule() {
  const usersModule = createModule();

  if (process.env.NODE_ENV === 'test') {
    usersModule.bind(DI_SYMBOLS.IUsersRepository).toClass(MockUsersRepository);
  } else {
    usersModule
      .bind(DI_SYMBOLS.IUsersRepository)
      .toClass(UsersRepository, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
      ]);
  }

  return usersModule;
}
