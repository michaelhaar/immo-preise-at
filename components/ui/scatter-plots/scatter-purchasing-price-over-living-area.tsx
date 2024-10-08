'use client';

import { useFiltersFromSearchParamsState } from '@/hooks/use-filters-from-search-params-state';
import { trpc } from '@/lib/trpc/client';
import { ChartContainer } from '../charts/chart-container';
import { ScatterPlot } from '../charts/scatter-plot';
import { Skeleton } from '../skeleton';

type Variant = 'buy' | 'rent';

export function ScatterPurchasingPriceOverLivingArea({ variant }: { variant: Variant }) {
  const filters = useFiltersFromSearchParamsState();

  const { data, error } = trpc.getScatterData.useQuery({ ...filters, variant });

  if (!data) {
    return <Skeleton className="aspect-square w-full" />;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <ChartContainer
      render={(width, height) => (
        <ScatterPlot
          data={data}
          xTicks={xTicksByVariant[variant]}
          yTicks={yTicksByVariant[variant]}
          xUnit="m²"
          yUnit={unitByVariant[variant]}
          width={width}
          height={height}
        />
      )}
    />
  );
}

const xTicksByVariant: Record<Variant, number[]> = {
  buy: [0, 50, 100, 150, 200],
  rent: [0, 50, 100, 150, 200],
};

const yTicksByVariant: Record<Variant, number[]> = {
  buy: [0, 250, 500, 750, 1000],
  rent: [0, 500, 1000, 1500, 2000, 2500],
};

const unitByVariant: Record<Variant, string> = {
  buy: 'k',
  rent: '€',
};
