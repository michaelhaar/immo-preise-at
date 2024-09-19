'use client';

import { useRegionsSearchParamsState } from '@/hooks/use-regions-search-params-state';
import { allDistricts, allPostalCodes, allStates } from '@/lib/postal-codes-by-district';
import { FancyMultiSelect } from '../fancy-multi-select';

const statesAndDistricts = [...allStates, ...allDistricts].sort();
const options = [...statesAndDistricts, ...allPostalCodes];

export function FilterRegions() {
  const [regions, setRegions] = useRegionsSearchParamsState();

  return (
    <FancyMultiSelect
      selectedOptions={regions}
      onSelectedOptionsChange={setRegions}
      options={options}
      emptyMessage="Keine Ergebnisse gefunden"
      placeholder="Bundesland, Bezirk oder PLZ"
    />
  );
}
