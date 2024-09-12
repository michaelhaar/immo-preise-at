'use client';

import { useQuery } from '@tanstack/react-query';
import { getHistogramData } from '@/actions/getHistogramData';
import { Histogram, HistogramData } from './histogram';

export function HistogramPurchasingPrice() {
  const { data, error, isPending } = useQuery({
    queryKey: ['getHistogramPurchasingPrice'],
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
      description="Anzahl der Inserate nach angebotenem Verkaufspreis"
      xLabel="Preisgruppen in Tausend €"
      yLabel="Anzahl"
    />
  );
}
