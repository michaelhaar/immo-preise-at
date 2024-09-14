'use client';

import { useFilters } from '@/hooks/use-filters';
import { trpc } from '@/lib/trpc/client';
import { Histogram, HistogramData } from './histogram';
import { getFormattedPercentage, getTotalCount } from './utils';

export function HistogramLivingArea() {
  const filters = useFilters();

  const { data, error, isPending } = trpc.getHistogramData.useQuery({
    targetColumnIndex: 1,
    binWidth: 15,
    upperLimit: 120,
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
