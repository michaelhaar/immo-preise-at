'use client';

import { useRealEstateListingTypeSearchParamsState } from '@/hooks/use-real-estate-listing-type-search-params-state';
import { RealEstateListingType } from '@/lib/constants';
import { FilterIcon } from 'lucide-react';
import { Button } from '../button';

export function Filters() {
  return (
    <div className="flex items-center">
      <RealEstateTypeFilter />
      <Button variant="ghost" size="icon">
        <FilterIcon />
      </Button>
    </div>
  );
}

function RealEstateTypeFilter() {
  const [realEstateListingType, setRealEstateListingType] = useRealEstateListingTypeSearchParamsState();

  const labelByRealEstateListingType: Record<RealEstateListingType, string> = {
    mietwohnung: 'Mietwohnungen',
    eigentumswohnung: 'Eigentumswohn.',
  };

  function toggleRealEstateListingType() {
    setRealEstateListingType(realEstateListingType === 'mietwohnung' ? 'eigentumswohnung' : 'mietwohnung');
  }

  return (
    <div className="flex items-center">
      <Button variant="ghost" size="sm" className="px-1" onClick={toggleRealEstateListingType}>
        {labelByRealEstateListingType[realEstateListingType]}
      </Button>
    </div>
  );
}
