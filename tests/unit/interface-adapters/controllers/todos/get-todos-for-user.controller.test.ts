import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { UnauthenticatedError } from '@/src/entities/errors/auth';

const signInUseCase = getInjection('ISignInUseCase');
const createTodoUseCase = getInjection('ICreateTodoUseCase');
const getTodosForUserController = getInjection('IGetTodosForUserController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns users todos', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  await expect(getTodosForUserController(session.id)).resolves.toMatchObject(
    []
  );

  await createTodoUseCase({ todo: 'todo-one' }, session.userId);
  await createTodoUseCase({ todo: 'todo-two' }, session.userId);
  await createTodoUseCase({ todo: 'todo-three' }, session.userId);

  await expect(getTodosForUserController(session.id)).resolves.toMatchObject([
    {
      todo: 'todo-one',
      completed: false,
      userId: '1',
    },
    {
      todo: 'todo-two',
      completed: false,
      userId: '1',
    },
    {
      todo: 'todo-three',
      completed: false,
      userId: '1',
    },
  ]);
});

it('throws when unauthenticated', () => {
  expect(getTodosForUserController('')).rejects.toBeInstanceOf(
    UnauthenticatedError
  );
  expect(getTodosForUserController(undefined)).rejects.toBeInstanceOf(
    UnauthenticatedError
  );
});
