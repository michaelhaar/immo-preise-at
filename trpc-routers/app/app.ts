import { createTRPCRouter } from '@/lib/trpc/init';
import { getHistogramData } from './getHistogramData';
import { getKeyPerformanceIndicatorData } from './getKeyPerformanceIndicatorData';
import { getNewListingsData } from './getNewListingsData';
import { getScatterData } from './getScatterData';

export const appRouter = createTRPCRouter({
  getHistogramData,
  getScatterData,
  getKeyPerformanceIndicatorData,
  getNewListingsData,
});

// export type definition of API
export type AppRouter = typeof appRouter;
