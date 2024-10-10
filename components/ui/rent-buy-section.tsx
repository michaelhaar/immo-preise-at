'use client';

import { KeyPerformanceIndicators } from '@/app/key-performance-indicators';
import { useEffect, useRef, useState } from 'react';
import { NewListingsChart } from './charts/new-listings-chart';
import { HistogramDataManager } from './histograms/histogram-data-manager';
import { ScatterPurchasingPriceOverLivingArea } from './scatter-plots/scatter-purchasing-price-over-living-area';

type Variant = 'buy' | 'rent';

export function RentBuySection({
  variant,
  isLazyRenderingEnabled,
}: {
  variant: Variant;
  isLazyRenderingEnabled?: boolean;
}) {
  const [shouldRenderData, setShouldRenderData] = useState(isLazyRenderingEnabled ? false : true);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!isLazyRenderingEnabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldRenderData(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isLazyRenderingEnabled]);

  return (
    <div ref={sectionRef}>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold sm:text-3xl">{sectionHeadingByVariant[variant]}</h2>
      </div>
      {shouldRenderData ? (
        <div className="mt-8 flex w-full flex-col items-center gap-8 pb-12">
          <KeyPerformanceIndicators variant={variant} />
          <NewListingsChart variant={variant} />
          <ScatterPurchasingPriceOverLivingArea variant={variant} />
          <HistogramDataManager variant={variant} target="price" />
          <HistogramDataManager variant={variant} target="livingArea" />
          <HistogramDataManager variant={variant} target="pricePerM2" />
        </div>
      ) : null}
    </div>
  );
}

const sectionHeadingByVariant: Record<Variant, string> = {
  buy: 'Preise Eigentumswohnungen',
  rent: 'Preise Mietwohnungen',
};
