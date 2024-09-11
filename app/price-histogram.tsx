'use client';

import { useQuery } from '@tanstack/react-query';
import { getHistogramData } from './actions';
import { Histogram, HistogramData } from '@/components/ui/histogram';

export function PriceHistogram() {
  const { data, error, isPending } = useQuery({
    queryKey: ['getHistogramData'],
    queryFn: () => getHistogramData({ targetColumnIndex: 0, binWidth: 50000, upperLimit: 700000 }),
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
        binLabel: `>${row.binFloor / 1000}`,
      };
    }
    return {
      ...row,
      binLabel: `${row.binFloor / 1000}`,
    };
  });

  return (
    <Histogram
      chartData={chartData}
      title="Preisverteilung"
      description="Anzahl der Inserate in den jeweiligen Preisgruppe"
      xLabel="Preisgruppen in Tausend €"
      yLabel="Anzahl"
    />
  );
}
