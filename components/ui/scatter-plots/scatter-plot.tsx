'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scatter, XAxis, YAxis, CartesianGrid, Line, ComposedChart } from 'recharts';
import { ChartConfig, ChartContainer } from '../chart';

const chartConfig = {
  count: {
    label: 'Anzahl',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

type DataPoint =
  | {
      x: number | null;
      y: number | null;
    }
  | {
      x: number;
      yLine: number;
    };

export type ScatterData = DataPoint[];

type Props = {
  data: ScatterData;
};

export default function ScatterPlot({ data }: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Scatter Plot</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              dataKey="x"
              name="X Axis"
              unit="m²"
              className="text-sm"
              domain={[0, 200]}
              allowDataOverflow
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Y Axis"
              unit="k€"
              className="text-sm"
              domain={[0, 1000]}
              allowDataOverflow
            />
            <Scatter name="Data Points" dataKey="y" fill="hsl(var(--primary))" isAnimationActive={false} />
            <Line type="monotone" dataKey="yLine" stroke="hsl(var(--primary))" strokeDasharray="5 5" />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
