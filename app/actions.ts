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
    { bin: '0-50k€', count: 186 },
    { bin: '50k€-100k€', count: 305 },
    { bin: '100k€-250k€', count: 237 },
    { bin: '250k€-300k€', count: 237 },
    { bin: '300k€-350k€', count: 73 },
    { bin: '350k€-400k€', count: 209 },
    { bin: '400k€-450k€', count: 209 },
    { bin: '450k€-500k€', count: 209 },
    { bin: '500k€-550k€', count: 209 },
    { bin: '550k€-600k€', count: 209 },
    { bin: '>600k€', count: 214 },
  ];
}
