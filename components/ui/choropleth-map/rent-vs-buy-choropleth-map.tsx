import { AustriaPostalCodeChoroplethMap } from './austria-postal-code-choropleth-map';

type RentVsBuyCardProps = {
  data: {
    postalCode: string;
    buyPrice: number;
    rentPrice: number;
    ratio: number;
  }[];
};

export function RentVsBuyChoroplethMap({ data }: RentVsBuyCardProps) {
  const cmap = createColorMap(data.map(({ ratio }) => ratio));

  const choroplethData = data.map((d) => ({
    postalCode: d.postalCode,
    fill: cmap(d.ratio),
    stroke: 'white',
    tooltip: `${d.postalCode}: ${d.ratio?.toFixed(2)}`,
  }));

  return <AustriaPostalCodeChoroplethMap data={choroplethData} width="100%" />;
}

function createColorMap(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (value: number) => {
    const ratio = (value - min) / (max - min);
    const hue = 120 - ratio * 120;
    return `hsl(${hue}, 100%, 50%)`;
  };
}
