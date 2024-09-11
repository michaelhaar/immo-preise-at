import { getDbClient } from './db-client';
import { formatNumber, getRequiredEnvVar } from '@/lib/utils';
import { unstable_noStore as noStore } from 'next/cache';

type KeyPerformanceIndicatorsData = {
  numberOfListings: number;
  medianLivingArea: number;
  averageLivingArea: number;
  medianPurchasingPrice: number;
  averagePurchasingPrice: number;
  medianPurchasingPricePerM2: number;
  averagePurchasingPricePerM2: number;
};

export async function KeyPerformanceIndicators() {
  noStore();
  const { rows } = await getDbClient().execute({
    sql: `
      SELECT
        COUNT(*) AS 'numberOfListings',
        MEDIAN(livingArea) AS 'medianLivingArea',
        AVG(livingArea) AS 'averageLivingArea',
        MEDIAN(purchasingPrice) AS 'medianPurchasingPrice',
        AVG(purchasingPrice) AS 'averagePurchasingPrice',
        MEDIAN(purchasingPricePerM2) AS 'medianPurchasingPricePerM2',
        AVG(purchasingPricePerM2) AS 'averagePurchasingPricePerM2'
      FROM
        tackedRealEstateListings
      WHERE
        userId = (:userId)
        AND projectName = (:projectName);
    `,
    args: {
      userId: getRequiredEnvVar('USER_ID'),
      projectName: getRequiredEnvVar('PROJECT_NAME'),
    },
  });

  const data = rows[0] as unknown as KeyPerformanceIndicatorsData;

  return (
    <div className="w-full max-w-96">
      <DataPair left="Anzahl der Inserate" right={formatNumber(data.numberOfListings, { decimalPlaces: 0 })} />
      <DataPair left="Median Größe" right={formatNumber(data.medianLivingArea, { decimalPlaces: 0, unit: 'm²' })} />
      <DataPair
        left="Durchschn. Größe"
        right={formatNumber(data.averageLivingArea, { decimalPlaces: 0, unit: 'm²' })}
      />
      <DataPair left="Median Preis" right={formatNumber(data.medianPurchasingPrice, { decimalPlaces: 0, unit: '€' })} />
      <DataPair
        left="Durchschn. Preis"
        right={formatNumber(data.averagePurchasingPrice, { decimalPlaces: 0, unit: '€' })}
      />
      <DataPair
        left="Median €/m²"
        right={formatNumber(data.medianPurchasingPricePerM2, { decimalPlaces: 0, unit: '€/m²' })}
      />
      <DataPair
        left="Durchschn. €/m²"
        right={formatNumber(data.averagePurchasingPricePerM2, { decimalPlaces: 0, unit: '€/m²' })}
      />
    </div>
  );
}

function DataPair({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex justify-between w-full">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
