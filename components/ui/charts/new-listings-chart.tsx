import { useFiltersFromSearchParamsState } from '@/hooks/use-filters-from-search-params-state';
import { trpc } from '@/lib/trpc/client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../chart';
import { Skeleton } from '../skeleton';

const chartConfig = {
  count: {
    label: 'Anzahl  Inserate',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function NewListingsChart({ variant }: { variant: 'buy' | 'rent' }) {
  const filters = useFiltersFromSearchParamsState();

  const { data, error } = trpc.getNewListingsData.useQuery({
    variant,
    postalCodes: filters.postalCodes,
    postalCodePrefixes: filters.postalCodePrefixes,
    lastNDays: 14,
  });

  if (!data) {
    return <Skeleton className="aspect-square w-full" />;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          left: -20,
          right: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          className="text-[8px]"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={12}
          tickFormatter={(value) => {
            return new Date(value).toLocaleDateString('de-AT', { weekday: 'short' });
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              nameKey="count"
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString('de-AT', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
              }}
            />
          }
        />
        <YAxis dataKey="count" className="text-[8px]" axisLine={false} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4}></Bar>
      </BarChart>
    </ChartContainer>
  );
}
