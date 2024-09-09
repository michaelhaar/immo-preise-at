'use server';

import { z } from 'zod';

const paramsSchema = z.object({
  postalCode: z.string(),
});
type Params = z.infer<typeof paramsSchema>;

export async function getHistogramData(unsafeParams: Params) {
  // parse and validate the input params
  const params = paramsSchema.parse(unsafeParams);
  console.log('params', params);

  // simulate a db call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // return data
  return [
    { bin: '0-10', count: 186 },
    { bin: '10-20', count: 305 },
    { bin: '20-30', count: 237 },
    { bin: '30-40', count: 73 },
    { bin: '40-50', count: 209 },
    { bin: '50-60', count: 214 },
  ];
}
