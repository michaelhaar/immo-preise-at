'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useFiltersFromSearchParamsState } from '@/hooks/use-filters-from-search-params-state';
import { trpc } from '@/lib/trpc/client';
import { formatNumber } from '@/lib/utils';

type Variant = 'buy' | 'rent';

export function KeyPerformanceIndicators({ variant }: { variant: Variant }) {
  const filters = useFiltersFromSearchParamsState();

  const { data, isPending, error } = trpc.getKeyPerformanceIndicatorData.useQuery({ ...filters, variant });

  if (isPending) {
    return (
      <div className="w-full max-w-96">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="my-1 h-6 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="w-full max-w-96">
      <DataPair left="Anzahl der Inserate" right={formatNumber(data.numberOfListings, { decimalPlaces: 0 })} />
      <DataPair left="Median Größe" right={formatNumber(data.medianLivingArea, { decimalPlaces: 0, unit: 'm²' })} />
      <DataPair
        left="Durchschn. Größe"
        right={formatNumber(data.averageLivingArea, { decimalPlaces: 0, unit: 'm²' })}
      />
      <DataPair left="Median Preis" right={formatNumber(data.medianPrice, { decimalPlaces: 0, unit: '€' })} />
      <DataPair left="Durchschn. Preis" right={formatNumber(data.averagePrice, { decimalPlaces: 0, unit: '€' })} />
      <DataPair left="Median €/m²" right={formatNumber(data.medianPricePerM2, { decimalPlaces: 0, unit: '€/m²' })} />
      <DataPair
        left="Durchschn. €/m²"
        right={formatNumber(data.averagePricePerM2, { decimalPlaces: 0, unit: '€/m²' })}
      />
    </div>
  );
}

function DataPair({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex w-full justify-between">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
