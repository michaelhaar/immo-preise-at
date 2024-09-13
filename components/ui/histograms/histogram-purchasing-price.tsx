'use client';

import { getHistogramData } from '@/actions/getHistogramData';
import { useQuery } from '@tanstack/react-query';
import { Histogram, HistogramData } from './histogram';
import { getFormattedPercentage, getTotalCount } from './utils';

export function HistogramPurchasingPrice() {
  const { data, error, isPending } = useQuery({
    queryKey: ['getHistogramPurchasingPrice'],
    queryFn: () => getHistogramData({ targetColumnIndex: 0, binWidth: 100000, upperLimit: 700000 }),
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
        binLabel: `>${row.binFloor / 1000}k`,
        label: getFormattedPercentage(totalCount, row.count),
      };
    }
    return {
      ...row,
      binLabel: `${row.binFloor / 1000}k`,
      label: getFormattedPercentage(totalCount, row.count),
    };
  });

  return <Histogram chartData={chartData} />;
}
