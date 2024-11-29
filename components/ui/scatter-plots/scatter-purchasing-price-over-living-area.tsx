'use client';

import { useFiltersFromSearchParamsState } from '@/hooks/use-filters-from-search-params-state';
import { RealEstateListingType } from '@/lib/constants';
import { trpc } from '@/lib/trpc/client';
import { ChartContainer } from '../charts/chart-container';
import { ScatterPlot } from '../charts/scatter-plot';
import { Skeleton } from '../skeleton';

type Variant = 'buy' | 'rent';

export function ScatterPurchasingPriceOverLivingArea() {
  const filters = useFiltersFromSearchParamsState();

  const { data, error } = trpc.getScatterData.useQuery(filters);

  if (!data) {
    return <Skeleton className="aspect-square w-full" />;
  }

  if (error) {
    return <div>Error</div>;
  }

  const { realEstateListingType } = filters;

  return (
    <ChartContainer
      render={(width, height) => (
        <ScatterPlot
          data={data}
          xTicks={xTicksByVariant[realEstateListingType]}
          yTicks={yTicksByVariant[realEstateListingType]}
          xUnit="m²"
          yUnit={unitByVariant[realEstateListingType]}
          width={width}
          height={height}
        />
      )}
    />
  );
}

const xTicksByVariant: Record<RealEstateListingType, number[]> = {
  eigentumswohnung: [0, 50, 100, 150, 200],
  mietwohnung: [0, 50, 100, 150, 200],
};

const yTicksByVariant: Record<RealEstateListingType, number[]> = {
  eigentumswohnung: [0, 250, 500, 750, 1000],
  mietwohnung: [0, 500, 1000, 1500, 2000, 2500],
};

const unitByVariant: Record<RealEstateListingType, string> = {
  eigentumswohnung: 'k',
  mietwohnung: '€',
};
