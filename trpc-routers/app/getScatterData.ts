import { getDbClient } from '@/lib/db-client';
import { baseProcedure } from '@/lib/trpc/init';
import { getRequiredEnvVar } from '@/lib/utils';
import { z } from 'zod';

export const getScatterData = baseProcedure
  .input(
    z.object({
      fromDate: z.string(),
      toDate: z.string(),
    }),
  )
  .output(
    z.array(
      z.object({
        x: z.number().nullable(),
        y: z.number().nullable(),
      }),
    ),
  )
  .query(async (opts) => {
    const { fromDate, toDate } = opts.input;

    // see: https://popsql.com/sql-templates/analytics/how-to-create-histograms-in-sql
    const { rows } = await getDbClient().execute({
      sql: `
      SELECT 
        purchasingPrice / 1000 AS y,
        livingArea AS x
      FROM 
        tackedRealEstateListings
      WHERE 
        userId = (:userId)
      AND 
        projectName = (:projectName)
      AND
        createdAt >= (:fromDate)
      AND
        createdAt <= (:toDate)
      ORDER BY
        lastSeenAt DESC
      LIMIT 5000
    `,
      args: {
        userId: getRequiredEnvVar('USER_ID'),
        projectName: getRequiredEnvVar('PROJECT_NAME'),
        fromDate,
        toDate,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows as any;
  });
