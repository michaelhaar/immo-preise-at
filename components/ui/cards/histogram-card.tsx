import clsx from 'clsx';
import { useState } from 'react';
import { Button } from '../button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { HistogramDataManager } from '../histograms/histogram-data-manager';

const targets = ['price', 'livingArea', 'pricePerM2'] as const;
type Target = (typeof targets)[number];

const labelByTarget: Record<Target, string> = {
  price: '€',
  livingArea: 'm²',
  pricePerM2: '€/m²',
};

export function HistogramCard({ variant }: { variant: 'buy' | 'rent' }) {
  const [selectedTarget, setSelectedTarget] = useState<Target>('price');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Häufigkeitsverteilung</CardTitle>
        <CardDescription>
          Diese Häufigkeitsverteilung zeigt dir, welche Werte am häufigsten vorkommen und welche seltener sind.
        </CardDescription>
        <div className="!mt-4 flex gap-1">
          {targets.map((target) => {
            return (
              <Button
                key={target}
                variant="ghost"
                className={clsx(selectedTarget !== target ? 'text-muted-foreground/50' : undefined)}
                onClick={() => setSelectedTarget(target)}
              >
                {labelByTarget[target]}
              </Button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        <HistogramDataManager variant={variant} target={selectedTarget} />
      </CardContent>
    </Card>
  );
}
