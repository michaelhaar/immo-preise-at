import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { ScatterPurchasingPriceOverLivingArea } from '../scatter-plots/scatter-purchasing-price-over-living-area';

export function ScatterCard({ variant }: { variant: 'buy' | 'rent' }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Preis vs. Wohnfläche</CardTitle>
        <CardDescription>Dieses Streudiagramm hilft dir, Muster, Trends und Korrelationen zu erkennen.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScatterPurchasingPriceOverLivingArea variant={variant} />
      </CardContent>
    </Card>
  );
}