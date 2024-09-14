'use client';

import { useFilters } from '@/hooks/use-filters';
import { trpc } from '@/lib/trpc/client';
import ScatterPlot from './scatter-plot';

export function ScatterPurchasingPriceOverLivingArea() {
  const filters = useFilters();

  const { data, error, isPending } = trpc.getScatterData.useQuery({
    fromDate: filters.fromDate,
    toDate: filters.toDate,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return <ScatterPlot data={data} />;
}
