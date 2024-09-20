import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  render: (width: number, height: number) => React.ReactNode;
};

export function ChartContainer({ render }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      const aspectRatio = width < 640 ? 1 : 16 / 9;
      const height = width / aspectRatio;
      setDimensions({ width, height });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [updateDimensions]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      {render(dimensions.width, dimensions.height)}
    </div>
  );
}
