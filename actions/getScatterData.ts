'use server';

import { z } from 'zod';
import { getDbClient } from '@/lib/db-client';
import { getRequiredEnvVar } from '@/lib/utils';

const paramsSchema = z.object({});
type Params = z.infer<typeof paramsSchema>;

const responseSchema = z.array(
  z.object({
    livingArea: z.number().nullable(),
    purchasingPrice: z.number().nullable(),
  })
);

export async function getScatterData(unsafeParams: Params) {
  // parse and validate the input params
  const {} = paramsSchema.parse(unsafeParams);

  // see: https://popsql.com/sql-templates/analytics/how-to-create-histograms-in-sql
  const { rows } = await getDbClient().execute({
    sql: `
      SELECT 
        purchasingPrice,
        livingArea
      FROM 
        tackedRealEstateListings
      WHERE 
        userId = (:userId)
      AND 
        projectName = (:projectName)
      ORDER BY
        lastSeenAt DESC
      LIMIT 5000
    `,
    args: {
      userId: getRequiredEnvVar('USER_ID'),
      projectName: getRequiredEnvVar('PROJECT_NAME'),
    },
  });

  return responseSchema.parse(rows);
}
