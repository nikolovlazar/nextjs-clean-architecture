import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(31),
  password_hash: z.string().min(6).max(255),
});

export type User = z.infer<typeof userSchema>;
