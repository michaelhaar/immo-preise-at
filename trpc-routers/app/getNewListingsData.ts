import { getDbClient } from '@/lib/db-client';
import { baseProcedure } from '@/lib/trpc/init';
import { getRequiredEnvVar, transformNamedArgsToPositionalArgs } from '@/lib/utils';
import { z } from 'zod';
import { getPostalCodeCondition } from './utils';

const outputSchema = z.array(
  z.object({
    day: z.string(),
    count: z.number(),
  }),
);

export const getNewListingsData = baseProcedure
  .input(
    z.object({
      variant: z.enum(['buy', 'rent']),
      postalCodes: z.array(z.string()),
      postalCodePrefixes: z.array(z.string()),
      fromDate: z.string(),
      toDate: z.string(),
    }),
  )
  .output(outputSchema)
  .query(async (opts) => {
    const { variant, postalCodes, postalCodePrefixes, fromDate, toDate } = opts.input;

    const priceColumn = variant === 'buy' ? 'purchasingPrice' : 'rent';
    const [postalCodeCondition, { postalCodesLike }] = getPostalCodeCondition({ postalCodes, postalCodePrefixes });

    const { rows } = await getDbClient().execute(
      transformNamedArgsToPositionalArgs({
        sql: `
          SELECT
            DATE(createdAt) AS 'day',
            COUNT(*) AS 'count'
          FROM
            tackedRealEstateListings
          WHERE
            userId = (:userId)
          AND 
            projectName = (:projectName)
          ${postalCodeCondition}
          AND
            createdAt >= (:fromDate)
          AND
            createdAt <= (:toDate)
          AND
            ${priceColumn} IS NOT NULL
          GROUP BY day
        ;`,
        args: {
          userId: getRequiredEnvVar('USER_ID'),
          projectName: getRequiredEnvVar('PROJECT_NAME'),
          fromDate,
          toDate,
          postalCodes,
          postalCodesLike,
        },
      }),
    );

    const parsedRows = outputSchema.parse(rows);
    return fillMissingDates(parsedRows, fromDate, toDate);
  });

function fillMissingDates(rows: z.infer<typeof outputSchema>, fromDate: string, toDate: string) {
  function getFromToDaysArray(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const days = [];
    for (let date = fromDate; date <= toDate; date.setDate(date.getDate() + 1)) {
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  }

  const FromToDaysArray = getFromToDaysArray(fromDate, toDate);
  for (const day of FromToDaysArray) {
    if (!rows.some((row) => row.day === day)) {
      rows.push({ day, count: 0 });
    }
  }

  return rows;
}
