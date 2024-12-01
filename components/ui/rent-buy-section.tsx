'use client';

import { HistogramCard } from './cards/histogram-card';
import { KpiCard } from './cards/kpi-card';
import { MapCard } from './cards/map-card';
import { NewListingsActivityCard } from './cards/new-listings-activity-card';
import { RentVsBuyCard } from './cards/rent-vs-buy-card';
import { ScatterCard } from './cards/scatter-card';

export function RentBuySection() {
  return (
    <div className="flex w-full flex-col items-center gap-8 pb-12">
      <KpiCard />
      <MapCard />
      <NewListingsActivityCard />
      <ScatterCard />
      <HistogramCard />
      <RentVsBuyCard />
    </div>
  );
}
