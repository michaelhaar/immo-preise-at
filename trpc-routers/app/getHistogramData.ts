import { getDbClient } from '@/lib/db-client';
import { baseProcedure } from '@/lib/trpc/init';
import { getRequiredEnvVar, transformNamedArgsToPositionalArgs } from '@/lib/utils';
import { z } from 'zod';
import { getPostalCodeCondition } from './utils';

const supportedTargetColumns = ['purchasingPrice', 'livingArea', 'rent'];

export const getHistogramData = baseProcedure
  .input(
    z.object({
      variant: z.enum(['buy', 'rent']),
      targetColumnIndex: z
        .number()
        .min(0)
        .max(supportedTargetColumns.length - 1),
      binWidth: z.number(),
      upperLimit: z.number(),
      postalCodes: z.array(z.string()),
      postalCodePrefixes: z.array(z.string()),
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
    const { variant, targetColumnIndex, binWidth, upperLimit, postalCodes, postalCodePrefixes, fromDate, toDate } =
      opts.input;
    const targetColumn = supportedTargetColumns[targetColumnIndex];
    const [postalCodeCondition, { postalCodesLike }] = getPostalCodeCondition({ postalCodes, postalCodePrefixes });

    // see: https://popsql.com/sql-templates/analytics/how-to-create-histograms-in-sql
    const { rows } = await getDbClient().execute(
      transformNamedArgsToPositionalArgs({
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
            ${postalCodeCondition}
            AND
              ${targetColumn} IS NOT NULL
            AND
              createdAt >= (:fromDate)
            AND
              createdAt <= (:toDate)
            AND
              ${variant === 'buy' ? 'purchasingPrice' : 'rent'} IS NOT NULL
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
          postalCodes,
          postalCodesLike,
          fromDate,
          toDate,
        },
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows as any;
  });
