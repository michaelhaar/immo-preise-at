import { getDbClient } from '@/lib/db-client';
import { baseProcedure } from '@/lib/trpc/init';
import { getRequiredEnvVar, transformNamedArgsToPositionalArgs } from '@/lib/utils';
import { z } from 'zod';
import { getPostalCodeCondition } from './utils';

export const getKeyPerformanceIndicatorData = baseProcedure
  .input(
    z.object({
      variant: z.enum(['buy', 'rent']),
      postalCodes: z.array(z.string()),
      postalCodePrefixes: z.array(z.string()),
      fromDate: z.string(),
      toDate: z.string(),
    }),
  )
  .output(
    z.object({
      numberOfListings: z.number(),
      medianLivingArea: z.number().nullable(),
      averageLivingArea: z.number().nullable(),
      medianPrice: z.number().nullable(),
      averagePrice: z.number().nullable(),
      medianPricePerM2: z.number().nullable(),
      averagePricePerM2: z.number().nullable(),
    }),
  )
  .query(async (opts) => {
    const { variant, postalCodes, postalCodePrefixes, fromDate, toDate } = opts.input;

    const priceColumn = variant === 'buy' ? 'purchasingPrice' : 'rent';
    const pricePerM2Column = variant === 'buy' ? 'purchasingPricePerM2' : 'rentPerM2';
    const [postalCodeCondition, { postalCodesLike }] = getPostalCodeCondition({ postalCodes, postalCodePrefixes });

    // see: https://popsql.com/sql-templates/analytics/how-to-create-histograms-in-sql
    const { rows } = await getDbClient().execute(
      transformNamedArgsToPositionalArgs({
        sql: `
          SELECT
            COUNT(*) AS 'numberOfListings',
            MEDIAN(livingArea) AS 'medianLivingArea',
            AVG(livingArea) AS 'averageLivingArea',
            MEDIAN(${priceColumn}) AS 'medianPrice',
            AVG(${priceColumn}) AS 'averagePrice',
            MEDIAN(${pricePerM2Column}) AS 'medianPricePerM2',
            AVG(${pricePerM2Column}) AS 'averagePricePerM2'
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows[0] as any;
  });
