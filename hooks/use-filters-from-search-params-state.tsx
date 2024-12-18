import { DateRangeOption } from '@/lib/constants';
import {
  isDistrict,
  isPostalCode,
  isState,
  postalCodesByDistrict,
  postalPrefixesByState,
} from '@/lib/postal-codes-by-district';
import { useMemo } from 'react';
import { useDateRangeSearchParamsState } from './use-date-range-search-params-state';
import { useRealEstateListingTypeSearchParamsState } from './use-real-estate-listing-type-search-params-state';
import { useRegionsSearchParamsState } from './use-regions-search-params-state';

export function useFiltersFromSearchParamsState() {
  const [_regions, _setRegions, parsedRegions] = useRegionsSearchParamsState(); // TODO
  const [_dateRange, _setDateRange, parsedDateRange] = useDateRangeSearchParamsState();
  const [_realEstateListingType, _setRealEstateListingType, parsedRealEstateListingType] =
    useRealEstateListingTypeSearchParamsState();

  const regionsJson = JSON.stringify(parsedRegions);
  const { postalCodes, postalCodePrefixes } = useMemo(() => getPostalCodes(JSON.parse(regionsJson)), [regionsJson]);
  const { fromDate, toDate } = useMemo(() => calculateDateRange(parsedDateRange), [parsedDateRange]);

  return {
    postalCodes,
    postalCodePrefixes,
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString(),
    realEstateListingType: parsedRealEstateListingType,
  };
}

function calculateDateRange(parsedDateRange: DateRangeOption) {
  const now = new Date();
  const fromDate = new Date();
  fromDate.setUTCHours(0, 0, 0, 0);
  const toDate = new Date();
  toDate.setUTCHours(23, 59, 59, 999);

  switch (parsedDateRange) {
    case '7T':
      fromDate.setDate(now.getDate() - 7);
      break;
    case '1M':
      fromDate.setMonth(now.getMonth() - 1);
      break;
    case '3M':
      fromDate.setMonth(now.getMonth() - 3);
      break;
    case '6M':
      fromDate.setMonth(now.getMonth() - 6);
      break;
    case '1J':
      fromDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      const _exhaustiveCheck: never = parsedDateRange;
      break;
  }

  return { fromDate, toDate };
}

function getPostalCodes(regions: string[]) {
  const postalCodes = new Set<string>();
  const postalCodePrefixes: string[] = [];

  regions.forEach((region) => {
    if (isPostalCode(region)) {
      postalCodes.add(region);
    }

    if (isDistrict(region)) {
      postalCodesByDistrict[region].forEach((postalCode) => {
        postalCodes.add(`${postalCode}`);
      });
    }

    if (isState(region)) {
      postalPrefixesByState[region].forEach((prefix) => {
        postalCodePrefixes.push(prefix);
      });
    }
  });

  return {
    postalCodes: Array.from(postalCodes),
    postalCodePrefixes,
  };
}
