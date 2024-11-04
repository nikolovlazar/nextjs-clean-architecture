import { hashSync } from 'bcrypt-ts';

import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { CreateUser, User } from '@/src/entities/models/user';
import { PASSWORD_SALT_ROUNDS } from '@/config';

export class MockUsersRepository implements IUsersRepository {
  private _users: User[];

  constructor() {
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
  async createUser(input: CreateUser): Promise<User> {
    const newUser: User = {
      id: this._users.length.toString(),
      username: input.username,
      password_hash: input.password,
    };
    this._users.push(newUser);
    return newUser;
  }
}
