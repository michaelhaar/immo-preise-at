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
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];
}
