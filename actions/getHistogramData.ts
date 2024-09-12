'use server';

import { z } from 'zod';
import { getDbClient } from '@/lib/db-client';
import { getRequiredEnvVar } from '@/lib/utils';

const supportedTargetColumns = ['purchasingPrice', 'livingArea'];

const paramsSchema = z.object({
  targetColumnIndex: z
    .number()
    .min(0)
    .max(supportedTargetColumns.length - 1),
  binWidth: z.number(),
  upperLimit: z.number(),
});
type Params = z.infer<typeof paramsSchema>;

const histogramDataSchema = z.array(
  z.object({
    binFloor: z.number(),
    count: z.number(),
  })
);

export async function getHistogramData(unsafeParams: Params) {
  // parse and validate the input params
  const { targetColumnIndex, binWidth, upperLimit } = paramsSchema.parse(unsafeParams);
  const targetColumn = supportedTargetColumns[targetColumnIndex];

  // see: https://popsql.com/sql-templates/analytics/how-to-create-histograms-in-sql
  const { rows } = await getDbClient().execute({
    sql: `
      WITH bins AS (
        SELECT 
          CASE
            WHEN ${targetColumn} >= (:upperLimit) THEN (:upperLimit)
            ELSE floor(${targetColumn} * 1.0 / (:binWidth)) * (:binWidth)
          END AS binFloor,
          count(id) AS count
        FROM 
          tackedRealEstateListings
        WHERE 
          userId = (:userId)
        AND 
          projectName = (:projectName)
        AND
          ${targetColumn} IS NOT NULL
        GROUP BY 1
        ORDER BY 1
      )

      SELECT 
        binFloor,
        count
      FROM bins
      ORDER BY 1;
    `,
    args: {
      userId: getRequiredEnvVar('USER_ID'),
      projectName: getRequiredEnvVar('PROJECT_NAME'),
      binWidth,
      upperLimit,
    },
  });

  return histogramDataSchema.parse(rows);
}
