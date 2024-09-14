'use client';

import { useFilters } from '@/hooks/use-filters';
import { trpc } from '@/lib/trpc/client';
import { Histogram, HistogramData } from './histogram';
import { getFormattedPercentage, getTotalCount } from './utils';

export function HistogramPurchasingPrice() {
  const filters = useFilters();

  const { data, error, isPending } = trpc.getHistogramData.useQuery({
    targetColumnIndex: 0,
    binWidth: 100000,
    upperLimit: 700000,
    fromDate: filters.fromDate,
    toDate: filters.toDate,
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
