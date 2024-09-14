import { getDbClient } from '@/lib/db-client';
import { baseProcedure } from '@/lib/trpc/init';
import { getRequiredEnvVar } from '@/lib/utils';
import { z } from 'zod';

export const getKeyPerformanceIndicatorData = baseProcedure
  .input(
    z.object({
      fromDate: z.string(),
      toDate: z.string(),
    }),
  )
  .output(
    z.object({
      numberOfListings: z.number(),
      medianLivingArea: z.number(),
      averageLivingArea: z.number(),
      medianPurchasingPrice: z.number(),
      averagePurchasingPrice: z.number(),
      medianPurchasingPricePerM2: z.number(),
      averagePurchasingPricePerM2: z.number(),
    }),
  )
  .query(async (opts) => {
    const { fromDate, toDate } = opts.input;

    // see: https://popsql.com/sql-templates/analytics/how-to-create-histograms-in-sql
    const { rows } = await getDbClient().execute({
      sql: `
      SELECT
        COUNT(*) AS 'numberOfListings',
        MEDIAN(livingArea) AS 'medianLivingArea',
        AVG(livingArea) AS 'averageLivingArea',
        MEDIAN(purchasingPrice) AS 'medianPurchasingPrice',
        AVG(purchasingPrice) AS 'averagePurchasingPrice',
        MEDIAN(purchasingPricePerM2) AS 'medianPurchasingPricePerM2',
        AVG(purchasingPricePerM2) AS 'averagePurchasingPricePerM2'
      FROM
        tackedRealEstateListings
      WHERE
        userId = (:userId)
      AND 
        projectName = (:projectName)
      AND
        createdAt >= (:fromDate)
      AND
        createdAt <= (:toDate);
    `,
      args: {
        userId: getRequiredEnvVar('USER_ID'),
        projectName: getRequiredEnvVar('PROJECT_NAME'),
        fromDate,
        toDate,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows[0] as any;
  });
