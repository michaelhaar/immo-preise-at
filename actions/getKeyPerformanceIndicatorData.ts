'use server';

import { getDbClient } from '@/lib/db-client';
import { getRequiredEnvVar } from '@/lib/utils';
import { z } from 'zod';

const paramsSchema = z.object({
  fromDate: z.string(),
  toDate: z.string(),
});
type Params = z.infer<typeof paramsSchema>;

const responseSchema = z.object({
  numberOfListings: z.number(),
  medianLivingArea: z.number(),
  averageLivingArea: z.number(),
  medianPurchasingPrice: z.number(),
  averagePurchasingPrice: z.number(),
  medianPurchasingPricePerM2: z.number(),
  averagePurchasingPricePerM2: z.number(),
});

export async function getKeyPerformanceIndicatorData(unsafeParams: Params) {
  // parse and validate the input params
  const { fromDate, toDate } = paramsSchema.parse(unsafeParams);

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

  return responseSchema.parse(rows[0]);
}
