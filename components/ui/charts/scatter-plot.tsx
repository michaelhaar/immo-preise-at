// @refresh reset
'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

type ScatterPlotData = {
  x: number;
  y: number;
}[];

type Props = {
  data: ScatterPlotData;
  width?: number;
  height?: number;
  xTicks: number[];
  yTicks: number[];
  xUnit?: string;
  yUnit?: string;
};

export function ScatterPlot({ data, width = 800, height = 400, xTicks, yTicks, xUnit, yUnit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const canvas = d3.select(canvasRef.current).node();
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.translate(0.5, 0.5);

    // Clear the canvas
    context.clearRect(0, 0, width, height);

    // Set up scales
    const x = d3
      .scaleLinear()
      .domain([xTicks[0], xTicks[xTicks.length - 1]])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([yTicks[0], yTicks[yTicks.length - 1]])
      .range([height - margin.bottom, margin.top]);

    // Draw grid
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 0.4;
    context.globalAlpha = 0.2;
    context.setLineDash([3, 3]);

    // Vertical grid lines
    xTicks.forEach((tickValue) => {
      context.moveTo(x(tickValue), margin.top);
      context.lineTo(x(tickValue), height - margin.bottom);
    });

    // Horizontal grid lines
    yTicks.forEach((tickValue) => {
      context.moveTo(margin.left, y(tickValue));
      context.lineTo(width - margin.right, y(tickValue));
    });

    context.stroke();

    // Draw points
    context.fillStyle = getComputedStyle(canvas).fill;
    context.globalAlpha = 0.4;
    data.forEach((d) => {
      // Check if the data point is within the x and y domains
      if (d.x >= x.domain()[0] && d.x <= x.domain()[1] && d.y >= y.domain()[0] && d.y <= y.domain()[1]) {
        context.beginPath();
        context.arc(x(d.x), y(d.y), 3, 0, 2 * Math.PI);
        context.fill();
      }
    });

    context.translate(-0.5, -0.5);

    // Create axes
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear existing axes

    const xAxis = d3.axisBottom(x).tickValues(xTicks);
    if (xUnit) xAxis.tickFormat((d) => `${d}${xUnit}`);
    const yAxis = d3.axisLeft(y).tickValues(yTicks);
    if (yUnit) yAxis.tickFormat((d) => `${d}${yUnit}`);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(yAxis);

    // Hide axis line
    svg.selectAll('.domain').style('display', 'none');

    // Set axis text color
    const textColor = getComputedStyle(canvas).color;
    const fontFamilies = getComputedStyle(canvas)
      .fontFamily.split(',')
      .map((font) => font.trim());
    const fontSize = getComputedStyle(canvas).fontSize;
    svg
      .selectAll('.tick text')
      .style('fill', textColor)
      .style('font-family', fontFamilies[0])
      .style('font-size', fontSize);
  }, [data, width, height, xTicks, yTicks, xUnit, yUnit]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0 }}
        className="fill-primary text-[8px] text-muted-foreground"
      />
      <svg ref={svgRef} width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  );
}
