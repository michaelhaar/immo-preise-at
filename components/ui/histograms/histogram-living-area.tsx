'use client';

import { useFiltersFromSearchParamsState } from '@/hooks/use-filters-from-search-params-state';
import { trpc } from '@/lib/trpc/client';
import { Skeleton } from '../skeleton';
import { Histogram, HistogramData } from './histogram';
import { getFormattedPercentage, getTotalCount } from './utils';

type Variant = 'buy' | 'rent';

export function HistogramLivingArea({ variant }: { variant: Variant }) {
  const filters = useFiltersFromSearchParamsState();

  const { data, error, isPending } = trpc.getHistogramData.useQuery({
    targetColumnIndex: 1,
    binWidth: 15,
    upperLimit: 120,
    variant,
    ...filters,
  });

  if (isPending) {
    return <Skeleton className="aspect-square w-full" />;
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
