'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRealEstateListingTypeSearchParamsState } from '@/hooks/use-real-estate-listing-type-search-params-state';
import { RealEstateListingType } from '@/lib/constants';
import { FilterIcon } from 'lucide-react';
import { Button } from '../button';
import { FilterDateRange } from './filter-date-range';

export function Filters() {
  return (
    <div className="flex items-center">
      <RealEstateTypeFilter />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <FilterIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Weitere Filter</DialogTitle>
            <div className="pt-4">
              <FilterDateRange />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
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
