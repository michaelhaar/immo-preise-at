'use client';

import { useFiltersFromSearchParamsState } from '@/hooks/use-search-params-state';
import { trpc } from '@/lib/trpc/client';
import ScatterPlot from './scatter-plot';

type Variant = 'buy' | 'rent';

export function ScatterPurchasingPriceOverLivingArea({ variant }: { variant: Variant }) {
  const filters = useFiltersFromSearchParamsState();

  const { data, error, isPending } = trpc.getScatterData.useQuery({ ...filters, variant });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <ScatterPlot
      data={data}
      xTicks={xTicksByVariant[variant]}
      yTicks={yTicksByVariant[variant]}
      unit={unitByVariant[variant]}
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
