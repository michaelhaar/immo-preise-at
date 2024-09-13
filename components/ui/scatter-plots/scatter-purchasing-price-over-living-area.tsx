'use client';

import { getScatterData } from '@/actions/getScatterData';
import { useFilters } from '@/hooks/use-filters';
import { useQuery } from '@tanstack/react-query';
import ScatterPlot from './scatter-plot';

export function ScatterPurchasingPriceOverLivingArea() {
  const filters = useFilters();

  const { data, error, isPending } = useQuery({
    queryKey: ['getScatterPurchasingPriceOverLivingArea', JSON.stringify(filters)],
    queryFn: () =>
      getScatterData({
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

  return <ScatterPlot data={data} />;
}
