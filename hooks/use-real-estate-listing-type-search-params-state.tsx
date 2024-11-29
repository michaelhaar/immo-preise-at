import { RealEstateListingType } from '@/lib/constants';
import { stringSerializer, useSearchParamsState } from './use-search-params-state';

export function useRealEstateListingTypeSearchParamsState() {
  return useSearchParamsState({
    name: 'realEstateListingType',
    parser: (value: string | null): RealEstateListingType => {
      return value === 'mietwohnung' ? 'mietwohnung' : 'eigentumswohnung';
    },
    serializer: stringSerializer,
    debounceInMs: 0,
  });
}
