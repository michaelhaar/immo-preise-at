import { useFiltersFromSearchParamsState } from '@/hooks/use-filters-from-search-params-state';
import { trpc } from '@/lib/trpc/client';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../chart';
import { Skeleton } from '../skeleton';

const chartConfig = {
  count: {
    label: 'Anzahl neue Inserate',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function NewListingsChart({ variant }: { variant: 'buy' | 'rent' }) {
  const filters = useFiltersFromSearchParamsState();

  const { data, error } = trpc.getNewListingsData.useQuery({
    variant,
    postalCodes: filters.postalCodes,
    postalCodePrefixes: filters.postalCodePrefixes,
    lastNDays: 30,
  });

  if (!data) {
    return <Skeleton className="aspect-square w-full" />;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="aspect-[3/2] w-full">
      <AreaChart
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
          minTickGap={0}
          tickFormatter={(value) => {
            const date = new Date(value);
            const isMonday = date.getDay() === 1;
            return isMonday ? date.toLocaleDateString('de-AT', { weekday: 'short' }) : '';
          }}
        />
        <YAxis dataKey="count" className="text-[8px]" axisLine={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              nameKey="count"
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString('de-AT', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
              }}
            />
          }
        />
        <defs>
          <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <YAxis dataKey="count" className="text-[8px]" axisLine={false} />
        <Area
          dataKey="count"
          type="bump"
          fill="url(#fillCount)"
          fillOpacity={0.4}
          stroke="var(--color-count)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
