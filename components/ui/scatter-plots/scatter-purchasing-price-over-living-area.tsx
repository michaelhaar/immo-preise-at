'use client';

import { getScatterData } from '@/app/actions/getScatterData';
import { useQuery } from '@tanstack/react-query';
import ScatterPlot, { ScatterData } from './scatter-plot';

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

  const chartData: ScatterData = data.map((row) => {
    return {
      x: row.livingArea,
      y: typeof row.purchasingPrice === 'number' ? row.purchasingPrice / 1000 : row.purchasingPrice,
    };
  });

  chartData.push({ x: 0, yLine: 0 });
  chartData.push({ x: 200, yLine: 920 });

  return <ScatterPlot data={chartData} />;
}
