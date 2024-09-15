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
  xTicks?: number[];
  yTicks?: number[];
  unit?: string;
};

export default function ScatterPlot({ data, xTicks, yTicks, unit }: Props) {
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
          ticks={xTicks}
          domain={xTicks ? [xTicks[0], xTicks[xTicks.length - 1]] : undefined}
          allowDataOverflow
          axisLine={false}
        />
        <YAxis
          reversed
          type="number"
          dataKey="y"
          name="Y Axis"
          unit={unit}
          className="text-[8px]"
          ticks={yTicks}
          domain={yTicks ? [yTicks[0], yTicks[yTicks.length - 1]] : undefined}
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
