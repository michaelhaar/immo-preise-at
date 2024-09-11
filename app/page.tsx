import { Suspense } from 'react';
import { KeyPerformanceIndicators } from './key-performance-indicators';
import { HistogramLivingArea } from '@/components/ui/histograms/histogram-living-area';
import { HistogramPurchasingPrice } from '@/components/ui/histograms/histogram-purchasing-price';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full">
        <h1 className="text-3xl font-bold">Preise Eigentumswohnungen Graz</h1>
        <Suspense fallback={<div>Lade...</div>}>
          <KeyPerformanceIndicators />
        </Suspense>
        <HistogramPurchasingPrice />
        <HistogramLivingArea />
      </main>
    </div>
  );
}
