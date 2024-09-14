import { getDbClient } from '@/lib/db-client';
import { baseProcedure } from '@/lib/trpc/init';
import { getRequiredEnvVar } from '@/lib/utils';
import { z } from 'zod';

const supportedTargetColumns = ['purchasingPrice', 'livingArea'];

export const getHistogramData = baseProcedure
  .input(
    z.object({
      targetColumnIndex: z
        .number()
        .min(0)
        .max(supportedTargetColumns.length - 1),
      binWidth: z.number(),
      upperLimit: z.number(),
      fromDate: z.string(),
      toDate: z.string(),
    }),
  )
  .output(
    z.array(
      z.object({
        binFloor: z.number(),
        count: z.number(),
      }),
    ),
  )
  .query(async (opts) => {
    const { targetColumnIndex, binWidth, upperLimit, fromDate, toDate } = opts.input;
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows as any;
  });
