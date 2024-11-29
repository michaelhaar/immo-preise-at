'use client';

import { HistogramCard } from './cards/histogram-card';
import { KpiCard } from './cards/kpi-card';
import { MapCard } from './cards/map-card';
import { NewListingsActivityCard } from './cards/new-listings-activity-card';
import { ScatterCard } from './cards/scatter-card';

type Variant = 'buy' | 'rent';

export function RentBuySection({ variant }: { variant: Variant }) {
  return (
    <div className="mt-8 flex w-full flex-col items-center gap-8 pb-12">
      <KpiCard variant={variant} />
      <MapCard variant={variant} />
      <NewListingsActivityCard variant={variant} />
      <ScatterCard variant={variant} />
      <HistogramCard variant={variant} />
    </div>
  );
}
