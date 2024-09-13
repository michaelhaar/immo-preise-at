'use client';

import { getScatterData } from '@/actions/getScatterData';
import { useQuery } from '@tanstack/react-query';
import ScatterPlot from './scatter-plot';

export function ScatterPurchasingPriceOverLivingArea() {
  const { data, error, isPending } = useQuery({
    queryKey: ['getScatterPurchasingPriceOverLivingArea'],
    queryFn: () => getScatterData({}),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return <ScatterPlot data={data} />;
}
