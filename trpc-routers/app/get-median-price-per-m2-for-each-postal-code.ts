import { getDbClient } from '@/lib/db-client';
import { baseProcedure } from '@/lib/trpc/init';
import { getRequiredEnvVar, transformNamedArgsToPositionalArgs } from '@/lib/utils';
import { z } from 'zod';
import { getPostalCodeCondition } from './utils';

const variants = ['buy', 'rent'] as const;
type Variant = (typeof variants)[number];

export const getMedianPricePerM2ForEachPostalCode = baseProcedure
  .input(
    z.object({
      variant: z.enum(variants),
      postalCodes: z.array(z.string()),
      postalCodePrefixes: z.array(z.string()),
      fromDate: z.string(),
      toDate: z.string(),
    }),
  )
  .output(
    z.array(
      z.object({
        postalCode: z.string(),
        median: z.number(),
        count: z.number(),
      }),
    ),
  )
  .query(async (opts) => {
    const { variant, postalCodes, postalCodePrefixes, fromDate, toDate } = opts.input;
    const targetColumn = targetColumnByVariant[variant];
    const [postalCodeCondition, { postalCodesLike }] = getPostalCodeCondition({ postalCodes, postalCodePrefixes });

    const { rows } = await getDbClient().execute(
      transformNamedArgsToPositionalArgs({
        sql: `
          SELECT
            MEDIAN(${targetColumn}) AS 'median',
            postalCode,
            COUNT(*) AS 'count'
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
          GROUP BY postalCode
        `,
        args: {
          userId: getRequiredEnvVar('USER_ID'),
          projectName: getRequiredEnvVar('PROJECT_NAME'),
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

const targetColumnByVariant: Record<Variant, string> = {
  buy: 'purchasingPricePerM2',
  rent: 'rentPerM2',
};
