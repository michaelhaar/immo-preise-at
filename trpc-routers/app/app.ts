import { createTRPCRouter } from '@/lib/trpc/init';
import { getMedianPricePerM2ForEachPostalCode } from './get-median-price-per-m2-for-each-postal-code';
import { getHistogramData } from './getHistogramData';
import { getKeyPerformanceIndicatorData } from './getKeyPerformanceIndicatorData';
import { getNewListingsData } from './getNewListingsData';
import { getScatterData } from './getScatterData';

export const appRouter = createTRPCRouter({
  getHistogramData,
  getScatterData,
  getKeyPerformanceIndicatorData,
  getNewListingsData,
  getMedianPricePerM2ForEachPostalCode,
});

// export type definition of API
export type AppRouter = typeof appRouter;
