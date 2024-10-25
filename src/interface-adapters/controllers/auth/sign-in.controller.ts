import { z } from 'zod';

import { getInjection } from '@/di/container';
import { signInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { InputParseError } from '@/src/entities/errors/common';
import { Cookie } from '@/src/entities/models/cookie';

const inputSchema = z.object({
  username: z.string().min(3).max(31),
  password: z.string().min(6).max(31),
});

export async function signInController(
  input: Partial<z.infer<typeof inputSchema>>
): Promise<Cookie> {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.startSpan(
    { name: 'signIn Controller' },
    async () => {
      const { data, error: inputParseError } = inputSchema.safeParse(input);

      if (inputParseError) {
        throw new InputParseError('Invalid data', { cause: inputParseError });
      }

      const { cookie } = await signInUseCase(data);
      return cookie;
    }
  );
}
