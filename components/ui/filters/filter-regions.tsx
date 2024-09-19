'use client';

import { useRegionsSearchParamsState } from '@/hooks/use-search-params-state';
import { allDistricts, allPostalCodes } from '@/lib/postal-codes-by-district';
import { FancyMultiSelect } from '../fancy-multi-select';

const options = [...allDistricts, ...allPostalCodes];

export function FilterRegions() {
  const [regions, setRegions] = useRegionsSearchParamsState();

  return (
    <FancyMultiSelect
      selectedOptions={regions}
      onSelectedOptionsChange={setRegions}
      options={options}
      emptyMessage="Keine Ergebnisse gefunden"
      placeholder="Bezirk oder PLZ"
    />
  );
}
