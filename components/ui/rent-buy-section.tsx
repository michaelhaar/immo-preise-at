'use client';

import { KeyPerformanceIndicators } from '@/app/key-performance-indicators';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { HistogramLivingArea } from './histograms/histogram-living-area';
import { HistogramPurchasingPrice } from './histograms/histogram-purchasing-price';
import { ScatterPurchasingPriceOverLivingArea } from './scatter-plots/scatter-purchasing-price-over-living-area';

type Variant = 'buy' | 'rent';

export function RentBuySection({ variant, isDefaultOpen = false }: { variant: Variant; isDefaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold sm:text-3xl">{sectionHeadingByVariant[variant]}</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="opacity-30">
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      {isOpen ? (
        <div className="mt-8 flex w-full flex-col items-center gap-8">
          <KeyPerformanceIndicators variant={variant} />
          <ScatterPurchasingPriceOverLivingArea variant={variant} />
          <HistogramPurchasingPrice variant={variant} />
          <HistogramLivingArea variant={variant} />
        </div>
      ) : null}
    </div>
  );
}

const sectionHeadingByVariant: Record<Variant, string> = {
  buy: 'Preise Eigentumswohnungen',
  rent: 'Preise Mietwohnungen',
};
