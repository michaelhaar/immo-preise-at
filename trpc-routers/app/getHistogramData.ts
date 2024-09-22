import { supportedHistogramColumnNames } from '@/lib/constants';
import { getDbClient } from '@/lib/db-client';
import { baseProcedure } from '@/lib/trpc/init';
import { getRequiredEnvVar, transformNamedArgsToPositionalArgs } from '@/lib/utils';
import { z } from 'zod';
import { getPostalCodeCondition } from './utils';

const outputSchema = z.array(
  z.object({
    binFloor: z.number(),
    count: z.number(),
  }),
);

export const getHistogramData = baseProcedure
  .input(
    z.object({
      targetColumnIndex: z
        .number()
        .min(0)
        .max(supportedHistogramColumnNames.length - 1),
      notNullColumnIndex: z
        .number()
        .min(0)
        .max(supportedHistogramColumnNames.length - 1),
      binWidth: z.number(),
      upperLimit: z.number(),
      postalCodes: z.array(z.string()),
      postalCodePrefixes: z.array(z.string()),
      fromDate: z.string(),
      toDate: z.string(),
    }),
  )
  .output(outputSchema)
  .query(async (opts) => {
    const {
      targetColumnIndex,
      notNullColumnIndex,
      binWidth,
      upperLimit,
      postalCodes,
      postalCodePrefixes,
      fromDate,
      toDate,
    } = opts.input;
    const targetColumn = supportedHistogramColumnNames[targetColumnIndex];
    const notNullColumn = supportedHistogramColumnNames[notNullColumnIndex];
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
              ${notNullColumn} IS NOT NULL
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

    const outputData = outputSchema.parse(rows);

    // handle edge case: some bins might be missing in the result if there are no listings in that bin
    for (let binFloor = 0; binFloor < upperLimit + binWidth; binFloor += binWidth) {
      if (!outputData.find((row) => row.binFloor === binFloor)) {
        outputData.push({ binFloor: Math.min(binFloor, upperLimit), count: 0 });
      }
    }
    outputData.sort((a, b) => a.binFloor - b.binFloor);

    return outputData;
  });
