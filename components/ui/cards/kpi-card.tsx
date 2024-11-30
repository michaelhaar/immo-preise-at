import { useFiltersFromSearchParamsState } from '@/hooks/use-filters-from-search-params-state';
import { trpc } from '@/lib/trpc/client';
import { formatNumber } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { Skeleton } from '../skeleton';

type Kpi = {
  label: string;
  value: string;
};

export function KpiCard() {
  const filters = useFiltersFromSearchParamsState();

  const { data, isLoading } = trpc.getKeyPerformanceIndicatorData.useQuery(filters, { placeholderData: undefined });

  function customFormatNumber(value: number | null | undefined, unit: string) {
    if (typeof value !== 'number') {
      return '-';
    }

    return formatNumber(value, { decimalPlaces: 0, unit });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kennzahlen</CardTitle>
        <CardDescription>Durchschnittswerte für deine Immobiliensuche.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Kpi
            label="Quadratmeterpreis"
            value={customFormatNumber(data?.medianPricePerM2, '€/m²')}
            isLoading={isLoading}
          />
          <Kpi
            label="Anzahl der Inserate"
            value={customFormatNumber(data?.numberOfListings, '')}
            isLoading={isLoading}
          />
          <Kpi label="Größe" value={customFormatNumber(data?.medianLivingArea, 'm²')} isLoading={isLoading} />
          <Kpi label="Preis" value={customFormatNumber(data?.medianPrice, '€')} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
}

function Kpi({ label, value, isLoading }: { label: string; value: string; isLoading?: boolean }) {
  return (
    <div>
      <div className="text-sm text-secondary-foreground">{label}</div>
      {isLoading ? <Skeleton className="h-7 w-1/3" /> : <div className="text-xl font-semibold">{value}</div>}
    </div>
  );
}
