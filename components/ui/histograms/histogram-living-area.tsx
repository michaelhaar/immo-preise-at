'use client';

import { getHistogramData } from '@/actions/getHistogramData';
import { useQuery } from '@tanstack/react-query';
import { Histogram, HistogramData } from './histogram';
import { getFormattedPercentage, getTotalCount } from './utils';

export function HistogramLivingArea() {
  const { data, error, isPending } = useQuery({
    queryKey: ['getHistogramLivingArea'],
    queryFn: () => getHistogramData({ targetColumnIndex: 1, binWidth: 15, upperLimit: 120 }),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  const totalCount = getTotalCount(data);
  const chartData: HistogramData = data.map((row, index) => {
    if (index === data.length - 1) {
      return {
        ...row,
        binLabel: `>${row.binFloor}m²`,
        label: getFormattedPercentage(totalCount, row.count),
      };
    }
    return {
      ...row,
      binLabel: `${row.binFloor}m²`,
      label: getFormattedPercentage(totalCount, row.count),
    };
  });

  return <Histogram chartData={chartData} />;
}
