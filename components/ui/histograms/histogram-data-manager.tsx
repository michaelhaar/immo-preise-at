'use client';

import { useFiltersFromSearchParamsState } from '@/hooks/use-filters-from-search-params-state';
import { getHistogramColumnIndexByColumnName, RealEstateListingType } from '@/lib/constants';
import { trpc } from '@/lib/trpc/client';
import { Skeleton } from '../skeleton';
import { Histogram, HistogramData } from './histogram';
import { getFormattedPercentage, getTotalCount } from './utils';

type Props = {
  target: 'livingArea' | 'pricePerM2' | 'price';
};

export function HistogramDataManager({ target }: Props) {
  const filters = useFiltersFromSearchParamsState();
  const { realEstateListingType } = filters;

  const { targetColumnIndex, notNullColumnIndex, binWidth, upperLimit, createLabel } =
    configByTargetAndRealEstateListingType[realEstateListingType][target];

  const { data, error } = trpc.getHistogramData.useQuery({
    targetColumnIndex,
    notNullColumnIndex,
    binWidth,
    upperLimit,
    ...filters,
  });

  if (!data) {
    return <Skeleton className="aspect-square w-full" />;
  }

  if (error) {
    return <div>Error</div>;
  }

  const totalCount = getTotalCount(data);
  const chartData: HistogramData = data.map((row, index) => {
    if (index === data.length - 1) {
      return {
        ...row,
        binLabel: `>${createLabel(row.binFloor)}`,
        label: getFormattedPercentage(totalCount, row.count),
      };
    }
    return {
      ...row,
      binLabel: `${createLabel(row.binFloor)}`,
      label: getFormattedPercentage(totalCount, row.count),
    };
  });

  return <Histogram chartData={chartData} />;
}

type Config = {
  targetColumnIndex: number;
  notNullColumnIndex: number;
  binWidth: number;
  upperLimit: number;
  createLabel: (number: number) => string;
};

const configByTargetAndRealEstateListingType: Record<RealEstateListingType, Record<Props['target'], Config>> = {
  eigentumswohnung: {
    livingArea: {
      targetColumnIndex: getHistogramColumnIndexByColumnName('livingArea'),
      notNullColumnIndex: getHistogramColumnIndexByColumnName('purchasingPrice'),
      binWidth: 15,
      upperLimit: 120,
      createLabel: (x) => `${x}m²`,
    },
    pricePerM2: {
      targetColumnIndex: getHistogramColumnIndexByColumnName('purchasingPricePerM2'),
      notNullColumnIndex: getHistogramColumnIndexByColumnName('purchasingPricePerM2'),
      binWidth: 1000,
      upperLimit: 10000,
      createLabel: (x) => `${x}€/m²`,
    },
    price: {
      targetColumnIndex: getHistogramColumnIndexByColumnName('purchasingPrice'),
      notNullColumnIndex: getHistogramColumnIndexByColumnName('purchasingPrice'),
      binWidth: 100000,
      upperLimit: 900000,
      createLabel: (x) => `${x / 1000}k`,
    },
  },
  mietwohnung: {
    livingArea: {
      targetColumnIndex: getHistogramColumnIndexByColumnName('livingArea'),
      notNullColumnIndex: getHistogramColumnIndexByColumnName('rent'),
      binWidth: 15,
      upperLimit: 120,
      createLabel: (x) => `${x}m²`,
    },
    pricePerM2: {
      targetColumnIndex: getHistogramColumnIndexByColumnName('rentPerM2'),
      notNullColumnIndex: getHistogramColumnIndexByColumnName('rentPerM2'),
      binWidth: 2.5,
      upperLimit: 30,
      createLabel: (x) => `${x}€/m²`,
    },
    price: {
      targetColumnIndex: getHistogramColumnIndexByColumnName('rent'),
      notNullColumnIndex: getHistogramColumnIndexByColumnName('rent'),
      binWidth: 200,
      upperLimit: 2000,
      createLabel: (x) => `${x}€`,
    },
  },
};
