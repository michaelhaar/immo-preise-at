'use client';

import { useQuery } from '@tanstack/react-query';
import { getHistogramData } from '@/app/actions';
import { Histogram, HistogramData } from './histogram';

export function HistogramLivingArea() {
  const { data, error, isPending } = useQuery({
    queryKey: ['getHistogramLivingArea'],
    queryFn: () => getHistogramData({ targetColumnIndex: 1, binWidth: 10, upperLimit: 120 }),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  const chartData: HistogramData = data.map((row, index) => {
    if (index === data.length - 1) {
      return {
        ...row,
        binLabel: `>${row.binFloor}`,
      };
    }
    return {
      ...row,
      binLabel: `${row.binFloor}`,
    };
  });

  return (
    <Histogram
      chartData={chartData}
      title="m² Verteilung"
      description="Anzahl der Inserate nach Wohnfläche"
      xLabel="Wohnfläche in m²"
      yLabel="Anzahl"
    />
  );
}
