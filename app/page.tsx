import { Suspense } from 'react';
import { KeyPerformanceIndicators } from './key-performance-indicators';
import { HistogramLivingArea } from '@/components/ui/histograms/histogram-living-area';
import { HistogramPurchasingPrice } from '@/components/ui/histograms/histogram-purchasing-price';
import { ScatterPurchasingPriceOverLivingArea } from '@/components/ui/scatter-plots/scatter-purchasing-price-over-living-area';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full">
        <h1 className="text-2xl sm:text-3xl font-bold">Preise Eigentumswohnungen Graz</h1>
        <Suspense fallback={<div>Lade...</div>}>
          <KeyPerformanceIndicators />
        </Suspense>
        <ScatterPurchasingPriceOverLivingArea />
        <HistogramPurchasingPrice />
        <HistogramLivingArea />
      </main>
    </div>
  );
}
