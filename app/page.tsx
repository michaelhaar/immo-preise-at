import { FilterDateRange } from '@/components/ui/filters/filter-date-range';
import { FilterRegions } from '@/components/ui/filters/filter-regions';
import { RentBuySection } from '@/components/ui/rent-buy-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-items-center gap-16 p-4 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex w-full max-w-3xl flex-col gap-8">
        <div>
          <div className="font-bold">Woher kommen die angezeigten Daten?</div>
          <p>
            <Link className="underline" href="https://www.willhaben.at/" target="_blank">
              Willhaben
            </Link>{' '}
            ist eine der beliebtesten Webseiten für Kleinanzeigen in Österreich. Mit dem{' '}
            <Link
              className="underline"
              href="https://apify.com/michaelhaar/willhaben-realestatescraper"
              target="_blank"
            >
              Willhaben RealEstateScraper
            </Link>{' '}
            werden Preis, m2 und PLZ von Immobilien-Inseraten anonymisiert extrahiert und auf dieser Seite aufbereitet,
            um dir einen Überblick über den Immobilienmarkt zu geben.
          </p>
        </div>
        <Suspense>
          <div>
            <div className="font-bold">Welche Region interessiert dich?</div>
            <div className="mt-4 flex gap-4">
              <FilterRegions />
              {/* <FilterDateRange /> */}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-xl font-bold sm:text-3xl">Angebotspreise</h2>
            <FilterDateRange />
          </div>
          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy">Eigentumswohnungen</TabsTrigger>
              <TabsTrigger value="rent">Mietwohnungen</TabsTrigger>
            </TabsList>
            <TabsContent value="buy">
              <RentBuySection variant="buy" />
            </TabsContent>
            <TabsContent value="rent">
              <RentBuySection variant="rent" />
            </TabsContent>
          </Tabs>
        </Suspense>
      </main>
    </div>
  );
}
