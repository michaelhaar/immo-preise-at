import { useFiltersFromSearchParamsState } from '@/hooks/use-filters-from-search-params-state';
import { trpc } from '@/lib/trpc/client';
import { AustriaPostalCodeChoroplethMap } from './austria-postal-code-choropleth-map';

type props = {
  variant: 'buy' | 'rent';
};

export function MedianPricePerM2ChoroplethMapManager({ variant }: props) {
  const filters = useFiltersFromSearchParamsState();

  const { data, error } = trpc.getMedianPricePerM2ForEachPostalCode.useQuery(
    {
      variant,
      postalCodes: filters.postalCodes,
      postalCodePrefixes: filters.postalCodePrefixes,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
    },
    { placeholderData: [] },
  );

  if (!data) {
    return null;
  }

  if (error) {
    return <div>Error</div>;
  }

  const cmap = createColorMap(data.map(({ median }) => median));

  const choroplethData = data.map(({ postalCode, median, count }) => ({
    postalCode,
    fill: cmap(median),
    stroke: 'white',
    tooltip: `${postalCode}: ${median.toFixed(variant === 'buy' ? 0 : 2)} €/m² (${count} Inserate)`,
  }));

  return <AustriaPostalCodeChoroplethMap data={choroplethData} height={400} />;
}

function createColorMap(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  const minLightness = 93.3;
  const maxLightness = 43.3;

  return (value: number) => {
    const lightness = minLightness + ((maxLightness - minLightness) * (value - min)) / (max - min);
    return `hsl(221.2, 83.2%, ${lightness}%)`;
  };
}
