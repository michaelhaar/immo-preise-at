'use client';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

const chartConfig = {
  count: {
    label: 'Anzahl',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export type HistogramData = {
  binLabel: string;
  count: number;
  label: string;
}[];

type Props = {
  chartData: HistogramData;
};

export function Histogram({ chartData }: Props) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: -20,
          right: 20,
        }}
        {...{
          overflow: 'visible', // see: https://github.com/recharts/recharts/issues/1618#issuecomment-1612155672
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="count" orientation="top" type="number" className="text-[8px]" axisLine={false} />
        <YAxis dataKey="binLabel" type="category" scale="band" className="text-[8px]" axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4}>
          <LabelList dataKey="label" position="right" className="text-[10px]" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
