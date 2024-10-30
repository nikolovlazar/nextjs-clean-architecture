import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { AuthenticationError } from '@/src/entities/errors/auth';

const signUpUseCase = getInjection('ISignUpUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns session and cookie', async () => {
  const result = await signUpUseCase({
    username: 'new',
    password: 'password-new',
  });
  expect(result).toHaveProperty('session');
  expect(result).toHaveProperty('cookie');
  expect(result).toHaveProperty('user');
});

it('throws for invalid input', () => {
  expect(() =>
    signUpUseCase({ username: 'one', password: 'doesntmatter' })
  ).rejects.toBeInstanceOf(AuthenticationError);
});
