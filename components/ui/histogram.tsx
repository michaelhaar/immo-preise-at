'use client';

import { Bar, BarChart, CartesianGrid, Label, LabelList, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

const chartConfig = {
  count: {
    label: 'Anzahl',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

type HistogramData = {
  bin: string;
  count: number;
}[];

type Props = {
  chartData: HistogramData;
  title?: string;
  description?: string;
  xLabel?: string;
  yLabel?: string;
};

export function Histogram({ chartData, title, description, xLabel, yLabel }: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="bin" tickLine={false} angle={-70} height={120} textAnchor="end">
              <Label value={xLabel} position="insideBottom" className="fill-foreground" fontSize={12} />
            </XAxis>
            <YAxis>
              <Label value={yLabel} position="insideLeft" className="fill-foreground" fontSize={12} angle={-90} />
            </YAxis>
            <Bar dataKey="count" fill="var(--color-count)" radius={4}>
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
