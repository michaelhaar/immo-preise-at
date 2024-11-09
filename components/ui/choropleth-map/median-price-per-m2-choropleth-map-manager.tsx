import { useFiltersFromSearchParamsState } from '@/hooks/use-filters-from-search-params-state';
import { allPostalCodes } from '@/lib/postal-codes-by-district';
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

  if (!data || (filters.postalCodes.length === 1 && filters.postalCodePrefixes.length === 0)) {
    return null;
  }

  if (error) {
    return <div>Error</div>;
  }

  const dataMap: Map<
    string,
    {
      postalCode: string;
      fill?: string;
      stroke?: string;
      tooltip?: string;
    }
  > = new Map();

  function addDefaultChoroplethData(postalCodes: string[]) {
    postalCodes.forEach((postalCode) => {
      dataMap.set(postalCode, {
        postalCode,
        fill: 'white',
        stroke: 'black',
        tooltip: `${postalCode}: Keine Inserate`,
      });
    });
  }

  if (filters.postalCodes.length === 0 && filters.postalCodePrefixes.length === 0) {
    addDefaultChoroplethData(allPostalCodes);
  }

  addDefaultChoroplethData(filters.postalCodes);

  filters.postalCodePrefixes.forEach((postalCodePrefix) => {
    const postalCodes = allPostalCodes.filter((postalCode) => postalCode.startsWith(postalCodePrefix));
    addDefaultChoroplethData(postalCodes);
  });

  const cmap = createColorMap(data.map(({ median }) => median));
  data.forEach(({ postalCode, median, count }) => {
    dataMap.set(postalCode, {
      postalCode,
      fill: cmap(median),
      stroke: 'white',
      tooltip: `${postalCode}: ${median.toFixed(variant === 'buy' ? 0 : 2)}\u00A0€/m² (${count}\u00A0Inserate)`,
    });
  });

  const choroplethData = Array.from(dataMap.values());

  return <AustriaPostalCodeChoroplethMap data={choroplethData} height="400px" width="100%" />;
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
