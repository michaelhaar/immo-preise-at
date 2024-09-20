'use client';

import { useFiltersFromSearchParamsState } from '@/hooks/use-filters-from-search-params-state';
import { trpc } from '@/lib/trpc/client';
import { Skeleton } from '../skeleton';
import { Histogram, HistogramData } from './histogram';
import { getFormattedPercentage, getTotalCount } from './utils';

type Variant = 'buy' | 'rent';

export function HistogramPurchasingPrice({ variant }: { variant: Variant }) {
  const filters = useFiltersFromSearchParamsState();

  const { data, error } = trpc.getHistogramData.useQuery({
    targetColumnIndex: variant === 'buy' ? 0 : 2,
    variant,
    binWidth: binWidthByVariant[variant],
    upperLimit: upperLimitByVariant[variant],
    ...filters,
  });

  if (!data) {
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
        binLabel: `>${transformerByVariant[variant](row.binFloor)}`,
        label: getFormattedPercentage(totalCount, row.count),
      };
    }
    return {
      ...row,
      binLabel: `${transformerByVariant[variant](row.binFloor)}`,
      label: getFormattedPercentage(totalCount, row.count),
    };
  });

  return <Histogram chartData={chartData} />;
}

const transformerByVariant: Record<Variant, (number: number) => string> = {
  buy: (x) => `${x / 1000}k`,
  rent: (x) => `${x}€`,
};

const binWidthByVariant: Record<Variant, number> = {
  buy: 100000,
  rent: 200,
};

const upperLimitByVariant: Record<Variant, number> = {
  buy: 900000,
  rent: 2000,
};
