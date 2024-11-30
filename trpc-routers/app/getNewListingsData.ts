import { realEstateListingTypes } from '@/lib/constants';
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
      realEstateListingType: z.enum(realEstateListingTypes),
      postalCodes: z.array(z.string()),
      postalCodePrefixes: z.array(z.string()),
      lastNDays: z.number(),
    }),
  )
  .output(outputSchema)
  .query(async (opts) => {
    const { realEstateListingType, postalCodes, postalCodePrefixes, lastNDays } = opts.input;

    const priceColumn = realEstateListingType === 'eigentumswohnung' ? 'purchasingPrice' : 'rent';
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
            createdAt >= DATE('NOW', '${-lastNDays} days')
          AND
            createdAt <= DATE('NOW', '+1 day')
          AND
            ${priceColumn} IS NOT NULL
          GROUP BY day
        ;`,
        args: {
          userId: getRequiredEnvVar('USER_ID'),
          projectName: getRequiredEnvVar('PROJECT_NAME'),
          postalCodes,
          postalCodesLike,
        },
      }),
    );

    const parsedRows = outputSchema.parse(rows);
    return fillMissingDates(parsedRows, lastNDays);
  });

function fillMissingDates(rows: z.infer<typeof outputSchema>, lastNDays: number) {
  const toDate = new Date();
  const fromDate = new Date(toDate);
  fromDate.setDate(fromDate.getDate() - lastNDays);

  const fromToDaysArray = [];
  for (let date = fromDate; date <= toDate; date.setDate(date.getDate() + 1)) {
    fromToDaysArray.push(date.toISOString().split('T')[0]);
  }

  for (const day of fromToDaysArray) {
    if (!rows.some((row) => row.day === day)) {
      rows.push({ day, count: 0 });
    }
  }

  return rows.sort((a, b) => a.day.localeCompare(b.day));
}
