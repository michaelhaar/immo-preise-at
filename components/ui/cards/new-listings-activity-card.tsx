import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { NewListingsChart } from '../charts/new-listings-chart';

export function NewListingsActivityCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Aktivität</CardTitle>
        <CardDescription>Anzahl der neuen Inserate in den letzten 30 Tagen</CardDescription>
      </CardHeader>
      <CardContent>
        <NewListingsChart />
      </CardContent>
    </Card>
  );
}
