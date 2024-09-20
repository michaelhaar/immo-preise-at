import { Barchart } from '@/components/ui/charts/bar-chart';
import { ScatterPlot } from '@/components/ui/charts/scatter-plot';
import { FilterRegions } from '@/components/ui/filters/filter-regions';
import Link from 'next/link';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
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
          <Barchart />
          <ScatterPlot />
          {/* <RentBuySection variant="buy" />
          <RentBuySection variant="rent" isLazyRenderingEnabled={true} /> */}
        </Suspense>
      </main>
    </div>
  );
}
