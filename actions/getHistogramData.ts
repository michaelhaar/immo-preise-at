'use server';

import { getDbClient } from '@/lib/db-client';
import { getRequiredEnvVar } from '@/lib/utils';
import { z } from 'zod';

const supportedTargetColumns = ['purchasingPrice', 'livingArea'];

const paramsSchema = z.object({
  targetColumnIndex: z
    .number()
    .min(0)
    .max(supportedTargetColumns.length - 1),
  binWidth: z.number(),
  upperLimit: z.number(),
  fromDate: z.string(),
  toDate: z.string(),
});
type Params = z.infer<typeof paramsSchema>;

const histogramDataSchema = z.array(
  z.object({
    binFloor: z.number(),
    count: z.number(),
  }),
);

export async function getHistogramData(unsafeParams: Params) {
  // parse and validate the input params
  const { targetColumnIndex, binWidth, upperLimit, fromDate, toDate } = paramsSchema.parse(unsafeParams);
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
        AND
          createdAt >= (:fromDate)
        AND
          createdAt <= (:toDate)
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
      fromDate,
      toDate,
    },
  });

  return histogramDataSchema.parse(rows);
}
