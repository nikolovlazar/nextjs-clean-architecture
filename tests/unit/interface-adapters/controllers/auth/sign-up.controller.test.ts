import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { SESSION_COOKIE } from '@/config';
import { InputParseError } from '@/src/entities/errors/common';
import { AuthenticationError } from '@/src/entities/errors/auth';

const signUpController = getInjection('ISignUpController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns cookie', async () => {
  const { cookie, user } = await signUpController({
    username: 'nikolovlazar',
    password: 'password',
    confirm_password: 'password',
  });

  expect(user).toBeDefined();
  expect(cookie).toMatchObject({
    name: SESSION_COOKIE,
    value: `random_session_id_${user.id}`,
    attributes: {},
  });
});

it('throws for invalid input', () => {
  // empty object
  expect(signUpController({})).rejects.toBeInstanceOf(InputParseError);

  // below min length
  expect(
    signUpController({
      username: 'no',
      password: 'no',
      confirm_password: 'nah',
    })
  ).rejects.toBeInstanceOf(InputParseError);

  // wrong passwords
  expect(
    signUpController({
      username: 'nikolovlazar',
      password: 'password',
      confirm_password: 'passwords',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws for existing username', () => {
  expect(
    signUpController({
      username: 'one',
      password: 'doesntmatter',
      confirm_password: 'doesntmatter',
    })
  ).rejects.toBeInstanceOf(AuthenticationError);
});
