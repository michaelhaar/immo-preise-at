'use client';

import { getKeyPerformanceIndicatorData } from '@/actions/getKeyPerformanceIndicatorData';
import { useFilters } from '@/hooks/use-filters';
import { formatNumber } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

export function KeyPerformanceIndicators() {
  const filters = useFilters();

  const { data, isPending, error } = useQuery({
    queryKey: ['getKeyPerformanceIndicators', JSON.stringify(filters)],
    queryFn: () =>
      getKeyPerformanceIndicatorData({
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      }),
  });

  if (isPending) {
    return <div>Loading...</div>;
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
      <DataPair left="Median Preis" right={formatNumber(data.medianPurchasingPrice, { decimalPlaces: 0, unit: '€' })} />
      <DataPair
        left="Durchschn. Preis"
        right={formatNumber(data.averagePurchasingPrice, { decimalPlaces: 0, unit: '€' })}
      />
      <DataPair
        left="Median €/m²"
        right={formatNumber(data.medianPurchasingPricePerM2, { decimalPlaces: 0, unit: '€/m²' })}
      />
      <DataPair
        left="Durchschn. €/m²"
        right={formatNumber(data.averagePurchasingPricePerM2, { decimalPlaces: 0, unit: '€/m²' })}
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
