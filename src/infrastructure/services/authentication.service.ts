import { inject, injectable } from "inversify";
import { generateIdFromEntropySize, Lucia } from "lucia";

import { luciaAdapter } from "@/drizzle";
import { IAuthenticationService } from "@/src/application/services/authentication.service.interface";
import {
  AuthenticationError,
  UnauthenticatedError,
} from "@/src/entities/errors/auth";
import { User } from "@/src/entities/models/user";
import { Session, sessionSchema } from "@/src/entities/models/session";
import { type IUsersRepository } from "@/src/application/repositories/users.repository.interface";
import { Cookie } from "@/src/entities/models/cookie";
import { DI_SYMBOLS } from "@/di/types";
import { SESSION_COOKIE } from "@/config";

@injectable()
export class AuthenticationService implements IAuthenticationService {
  private _lucia: Lucia;

  constructor(
    @inject(DI_SYMBOLS.IUsersRepository)
    private _usersRepository: IUsersRepository,
  ) {
    this._lucia = new Lucia(luciaAdapter, {
      sessionCookie: {
        name: SESSION_COOKIE,
        expires: false,
        attributes: {
          secure: process.env.NODE_ENV === "production",
        },
      },
      getUserAttributes: (attributes) => {
        return {
          username: attributes.username,
        };
      },
    });
  }

  async validateSession(
    sessionId: string,
  ): Promise<{ user: User; session: Session }> {
    const result = await this._lucia.validateSession(sessionId);

    if (!result.user || !result.session) {
      throw new UnauthenticatedError("Unauthenticated");
    }

    const user = await this._usersRepository.getUser(result.user.id);

    if (!user) {
      throw new UnauthenticatedError("User doesn't exist");
    }

    return { user, session: result.session };
  }

  async createSession(
    user: User,
  ): Promise<{ session: Session; cookie: Cookie }> {
    const luciaSession = await this._lucia.createSession(user.id, {});
    const session = sessionSchema.parse(luciaSession);
    const cookie = this._lucia.createSessionCookie(session.id);

    return { session, cookie };
  }

  async invalidateSession(sessionId: string): Promise<{ blankCookie: Cookie }> {
    await this._lucia.invalidateSession(sessionId);
    const blankCookie = this._lucia.createBlankSessionCookie();
    return { blankCookie };
  }

  generateUserId(): string {
    return generateIdFromEntropySize(10);
  }
}

interface DatabaseUserAttributes {
  username: string;
}

declare module "lucia" {
  interface Register {
    Lucia: Lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
