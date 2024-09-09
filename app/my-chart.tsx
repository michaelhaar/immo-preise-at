'use client';

import { Bar, BarChart } from 'recharts';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { useQuery } from '@tanstack/react-query';
import { getHistogramData } from './actions';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
} satisfies ChartConfig;

export function MyChart() {
  const { data, error, isPending } = useQuery({
    queryKey: ['getHistogramData'],
    queryFn: () => getHistogramData({ postalCode: '8010' }),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
