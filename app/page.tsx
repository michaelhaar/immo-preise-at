import { FilterDateRange } from '@/components/ui/filters/filter-date-range';
import { FilterPostalCode } from '@/components/ui/filters/filter-postal-code';
import { HistogramLivingArea } from '@/components/ui/histograms/histogram-living-area';
import { HistogramPurchasingPrice } from '@/components/ui/histograms/histogram-purchasing-price';
import { ScatterPurchasingPriceOverLivingArea } from '@/components/ui/scatter-plots/scatter-purchasing-price-over-living-area';
import { Suspense } from 'react';
import { KeyPerformanceIndicators } from './key-performance-indicators';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex w-full max-w-3xl flex-col items-center gap-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Preise Eigentumswohnungen Graz</h1>
        <Suspense>
          <div className="flex gap-4">
            <FilterPostalCode />
            <FilterDateRange />
          </div>
          <KeyPerformanceIndicators />
          <ScatterPurchasingPriceOverLivingArea />
          <HistogramPurchasingPrice />
          <HistogramLivingArea />
        </Suspense>
      </main>
    </div>
  );
}
