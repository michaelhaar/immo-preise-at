import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { MedianPricePerM2ChoroplethMapManager } from '../choropleth-map/median-price-per-m2-choropleth-map-manager';

export function MapCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kartenansicht</CardTitle>
        <CardDescription>
          Diese Karte zeigt dir die durchschnittlichen Quadratmeterpreise in den verschiedenen Regionen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MedianPricePerM2ChoroplethMapManager />
      </CardContent>
    </Card>
  );
}
