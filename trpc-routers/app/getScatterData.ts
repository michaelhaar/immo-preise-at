import { realEstateListingTypes } from '@/lib/constants';
import { getDbClient } from '@/lib/db-client';
import { baseProcedure } from '@/lib/trpc/init';
import { getRequiredEnvVar, transformNamedArgsToPositionalArgs } from '@/lib/utils';
import { z } from 'zod';
import { getPostalCodeCondition } from './utils';

export const getScatterData = baseProcedure
  .input(
    z.object({
      realEstateListingType: z.enum(realEstateListingTypes),
      postalCodes: z.array(z.string()),
      postalCodePrefixes: z.array(z.string()),
      fromDate: z.string(),
      toDate: z.string(),
    }),
  )
  .output(
    z.array(
      z.object({
        x: z.number(),
        y: z.number(),
      }),
    ),
  )
  .query(async (opts) => {
    const { realEstateListingType, postalCodes, postalCodePrefixes, fromDate, toDate } = opts.input;

    const [postalCodeCondition, { postalCodesLike }] = getPostalCodeCondition({ postalCodes, postalCodePrefixes });

    // see: https://popsql.com/sql-templates/analytics/how-to-create-histograms-in-sql
    const { rows } = await getDbClient().execute(
      transformNamedArgsToPositionalArgs({
        sql: `
          SELECT 
            ${realEstateListingType === 'eigentumswohnung' ? 'purchasingPrice / 1000' : 'rent'} AS y,
            livingArea AS x
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
            ${realEstateListingType === 'eigentumswohnung' ? 'purchasingPrice' : 'rent'} IS NOT NULL
          AND
            livingArea IS NOT NULL
          ORDER BY
            createdAt DESC
          LIMIT 5000
        `,
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows as any;
  });
