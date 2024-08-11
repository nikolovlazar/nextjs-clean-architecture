import { getInjection } from "@/di/container";
import { AuthenticationError } from "@/src/entities/errors/auth";
import { Cookie } from "@/src/entities/models/cookie";
import { Session } from "@/src/entities/models/session";
import { verify } from "@node-rs/argon2";

export async function signInUseCase(input: {
  username: string;
  password: string;
}): Promise<{ session: Session; cookie: Cookie }> {
  const authenticationService = getInjection("IAuthenticationService");
  const usersRepository = getInjection("IUsersRepository");

  const existingUser = await usersRepository.getUserByUsername(input.username);

  if (!existingUser) {
    throw new AuthenticationError("User does not exist");
  }

  const validPassword = await verify(
    existingUser.password_hash,
    input.password,
    {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    },
  );

  if (!validPassword) {
    throw new AuthenticationError("Incorrect username or password");
  }

  return await authenticationService.createSession(existingUser);
}
