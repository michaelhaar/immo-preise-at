'use client';

import { KeyPerformanceIndicators } from '@/app/key-performance-indicators';
import { NewListingsChart } from './charts/new-listings-chart';
import { MedianPricePerM2ChoroplethMapManager } from './choropleth-map/median-price-per-m2-choropleth-map-manager';
import { HistogramDataManager } from './histograms/histogram-data-manager';
import { ScatterPurchasingPriceOverLivingArea } from './scatter-plots/scatter-purchasing-price-over-living-area';

type Variant = 'buy' | 'rent';

export function RentBuySection({ variant }: { variant: Variant }) {
  console.log('rendering RentBuySection', variant);

  return (
    <div className="mt-8 flex w-full flex-col items-center gap-8 pb-12">
      <MedianPricePerM2ChoroplethMapManager variant={variant} />
      <KeyPerformanceIndicators variant={variant} />
      <NewListingsChart variant={variant} />
      <ScatterPurchasingPriceOverLivingArea variant={variant} />
      <HistogramDataManager variant={variant} target="price" />
      <HistogramDataManager variant={variant} target="livingArea" />
      <HistogramDataManager variant={variant} target="pricePerM2" />
    </div>
  );
}
