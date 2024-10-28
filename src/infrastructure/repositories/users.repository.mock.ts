import { hashSync } from 'bcrypt-ts';

import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { User } from '@/src/entities/models/user';
import { PASSWORD_SALT_ROUNDS } from '@/config';

export class MockUsersRepository implements IUsersRepository {
  private _users: User[];

  constructor() {
    const hashOptions = {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    };

    this._users = [
      {
        id: '1',
        username: 'one',
        password_hash: hashSync('password-one', PASSWORD_SALT_ROUNDS),
      },
      {
        id: '2',
        username: 'two',
        password_hash: hashSync('password-two', PASSWORD_SALT_ROUNDS),
      },
      {
        id: '3',
        username: 'three',
        password_hash: hashSync('password-three', PASSWORD_SALT_ROUNDS),
      },
    ];
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = this._users.find((u) => u.id === id);
    return user;
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = this._users.find((u) => u.username === username);
    return user;
  }
  async createUser(input: User): Promise<User> {
    this._users.push(input);
    return input;
  }
}
