'use client';

import { useFiltersFromSearchParamsState } from '@/hooks/use-filters-from-search-params-state';
import { trpc } from '@/lib/trpc/client';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { Button } from '../button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { RentVsBuyChoroplethMap } from '../choropleth-map/rent-vs-buy-choropleth-map';
import { RentVsBuyTable } from '../tables/rent-vs-buy-table';

const visualizationVariants = ['table', 'map'] as const;
type VisualizationVariant = (typeof visualizationVariants)[number];
const labelByVisualizationVariant: Record<VisualizationVariant, string> = {
  table: 'Tabelle',
  map: 'Karte',
};

export function RentVsBuyCard() {
  const [selectedVisualizationVariant, setSelectedVisualizationVariant] = useState<VisualizationVariant>('table');
  const filters = useFiltersFromSearchParamsState();

  const { data: buyData } = trpc.getMedianPricePerM2ForEachPostalCode.useQuery({
    ...filters,
    realEstateListingType: 'eigentumswohnung',
  });
  const { data: rentData } = trpc.getMedianPricePerM2ForEachPostalCode.useQuery({
    ...filters,
    realEstateListingType: 'mietwohnung',
  });

  // merge buyData and rentData together
  const data = useMemo(() => {
    if (!buyData || !rentData) {
      return [];
    }

    const allPostalCodes = [...new Set([...buyData.map((d) => d.postalCode), ...rentData.map((d) => d.postalCode)])];
    return allPostalCodes
      .map((postalCode) => {
        const buyPrice = buyData.find((d) => d.postalCode === postalCode)?.median;
        const rentPrice = rentData.find((d) => d.postalCode === postalCode)?.median;

        if (!buyPrice || !rentPrice) {
          return null;
        }

        return {
          postalCode,
          buyPrice,
          rentPrice,
          ratio: buyPrice / rentPrice,
        };
      })
      .filter((d) => d !== null);
  }, [buyData, rentData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kaufen vs Mieten</CardTitle>
        <CardDescription>
          Das Verhältnis von Kauf- zu Mietpreis gibt an, wie viele Mietzahlungen nötig wären, um den Kaufpreis zu
          decken.
        </CardDescription>
        <ul className="ml-4 list-disc text-sm text-muted-foreground">
          <li>Je niedriger, desto eher lohnt sich der Kauf bzw. das Vermieten.</li>
          <li>Je höher, desto eher lohnt sich das Mieten.</li>
        </ul>

        <div className="!mt-4 flex gap-1">
          {visualizationVariants.map((visualizationVariant) => (
            <Button
              variant="ghost"
              className={clsx(
                visualizationVariant !== selectedVisualizationVariant ? 'text-muted-foreground/50' : undefined,
              )}
              onClick={() => setSelectedVisualizationVariant(visualizationVariant)}
            >
              {labelByVisualizationVariant[visualizationVariant]}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {selectedVisualizationVariant === 'table' ? (
          <RentVsBuyTable data={data} />
        ) : (
          <RentVsBuyChoroplethMap data={data} />
        )}
      </CardContent>
    </Card>
  );
}
