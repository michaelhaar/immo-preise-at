'use client';

import { useQuery } from '@tanstack/react-query';
import { getHistogramData } from './actions';
import { Histogram } from '@/components/ui/histogram';

export function PriceHistogram() {
  const { data, error, isPending } = useQuery({
    queryKey: ['getHistogramData'],
    queryFn: () => getHistogramData({ postalCode: '8010' }),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <Histogram
      chartData={data}
      title="Preisverteilung"
      description="Anzahl der Inserate in den jeweiligen Preisgruppe"
      xLabel="Preisgruppen"
      yLabel="Anzahl"
    />
  );
}
