'use client';

import { CartesianGrid, Dot, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import { ChartContainer } from '../chart';

type DataPoint = {
  x: number | null;
  y: number | null;
};

export type ScatterData = DataPoint[];

type Props = {
  data: ScatterData;
};

export default function ScatterPlot({ data }: Props) {
  return (
    <ChartContainer config={{}}>
      <ScatterChart
        data={data}
        margin={{
          left: -20,
          right: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          orientation="top"
          type="number"
          dataKey="x"
          name="X Axis"
          unit="m²"
          className="text-[8px]"
          domain={[0, 200]}
          allowDataOverflow
          axisLine={false}
        />
        <YAxis
          reversed
          type="number"
          dataKey="y"
          name="Y Axis"
          unit="k"
          className="text-[8px]"
          domain={[0, 1000]}
          allowDataOverflow
          axisLine={false}
        />
        <Scatter
          name="Data Points"
          dataKey="y"
          fill="hsl(var(--primary))"
          isAnimationActive={false}
          shape={<CustomDot />}
        />
      </ScatterChart>
    </ChartContainer>
  );
}

function CustomDot({ cx, cy }: { cx?: number; cy?: number }) {
  return <Dot cx={cx} cy={cy} fill="hsl(var(--primary))" r={3} style={{ opacity: 0.4 }} />;
}
