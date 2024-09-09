'use server';

import { z } from 'zod';

const userParamsSchema = z.object({
  email: z.string(),
  password: z.string(),
});
type GetUserParams = z.infer<typeof userParamsSchema>;

export async function getUser(unsafeParams: GetUserParams) {
  const { email, password } = userParamsSchema.parse(unsafeParams);

  // simulate a db call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { name: 'Michi', email: 'michi@asdf.at' };
}
