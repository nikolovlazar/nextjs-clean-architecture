import { expect, it } from 'vitest';

import { resolveDependency } from '@/di/container';

const signInUseCase = resolveDependency('ISignInUseCase');
const createTodoUseCase = resolveDependency('ICreateTodoUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('creates todo', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  expect(
    createTodoUseCase({ todo: 'Write unit tests' }, session.userId)
  ).resolves.toMatchObject({
    todo: 'Write unit tests',
    userId: '1',
    completed: false,
  });
});
