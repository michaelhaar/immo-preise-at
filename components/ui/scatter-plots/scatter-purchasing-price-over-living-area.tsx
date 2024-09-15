'use client';

import { useFiltersFromSearchParamsState } from '@/hooks/use-search-params-state';
import { trpc } from '@/lib/trpc/client';
import ScatterPlot from './scatter-plot';

export function ScatterPurchasingPriceOverLivingArea() {
  const filters = useFiltersFromSearchParamsState();

  const { data, error, isPending } = trpc.getScatterData.useQuery(filters);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return <ScatterPlot data={data} />;
}
