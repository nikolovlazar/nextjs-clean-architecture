import { generateIdFromEntropySize, Lucia } from 'lucia';
import { compare } from 'bcrypt-ts';

import { SESSION_COOKIE } from '@/config';
import { luciaAdapter } from '@/drizzle';
import { type IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { Cookie } from '@/src/entities/models/cookie';
import { Session, sessionSchema } from '@/src/entities/models/session';
import { User } from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

export class AuthenticationService implements IAuthenticationService {
  private _lucia: Lucia;

  constructor(
    private readonly _usersRepository: IUsersRepository,
    private readonly _instrumentationService: IInstrumentationService
  ) {
    this._lucia = new Lucia(luciaAdapter, {
      sessionCookie: {
        name: SESSION_COOKIE,
        expires: false,
        attributes: {
          secure: process.env.NODE_ENV === 'production',
        },
      },
      getUserAttributes: (attributes) => {
        return {
          username: attributes.username,
        };
      },
    });
  }

  validatePasswords(
    inputPassword: string,
    usersHashedPassword: string
  ): Promise<boolean> {
    return this._instrumentationService.startSpan(
      { name: 'verify password hash', op: 'function' },
      () => compare(inputPassword, usersHashedPassword)
    );
  }

  async validateSession(
    sessionId: string
  ): Promise<{ user: User; session: Session }> {
    return await this._instrumentationService.startSpan(
      { name: 'AuthenticationService > validateSession' },
      async () => {
        const result = await this._instrumentationService.startSpan(
          { name: 'lucia.validateSession', op: 'function' },
          () => this._lucia.validateSession(sessionId)
        );

        if (!result.user || !result.session) {
          throw new UnauthenticatedError('Unauthenticated');
        }

        const user = await this._usersRepository.getUser(result.user.id);

        if (!user) {
          throw new UnauthenticatedError("User doesn't exist");
        }

        return { user, session: result.session };
      }
    );
  }

  async createSession(
    user: User
  ): Promise<{ session: Session; cookie: Cookie }> {
    return await this._instrumentationService.startSpan(
      { name: 'AuthenticationService > createSession' },
      async () => {
        const luciaSession = await this._instrumentationService.startSpan(
          { name: 'lucia.createSession', op: 'function' },
          () => this._lucia.createSession(user.id, {})
        );

        const session = sessionSchema.parse(luciaSession);
        const cookie = await this._instrumentationService.startSpan(
          { name: 'lucia.createSessionCookie', op: 'function' },
          () => this._lucia.createSessionCookie(session.id)
        );

        return { session, cookie };
      }
    );
  }

  async invalidateSession(sessionId: string): Promise<{ blankCookie: Cookie }> {
    await this._instrumentationService.startSpan(
      { name: 'lucia.invalidateSession', op: 'function' },
      () => this._lucia.invalidateSession(sessionId)
    );

    const blankCookie = this._instrumentationService.startSpan(
      { name: 'lucia.createBlankSessionCookie', op: 'function' },
      () => this._lucia.createBlankSessionCookie()
    );

    return { blankCookie };
  }

  generateUserId(): string {
    return this._instrumentationService.startSpan(
      { name: 'AuthenticationService > generateUserId', op: 'function' },
      () => generateIdFromEntropySize(10)
    );
  }
}

interface DatabaseUserAttributes {
  username: string;
}

declare module 'lucia' {
  interface Register {
    Lucia: Lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
