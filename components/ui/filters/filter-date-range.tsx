'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParamsState } from '@/hooks/use-search-params-state';
import { dateRangeOptions, defaultDateRangeOption } from '@/lib/constants';
import { isDateRangeOption } from '@/lib/utils';

export function FilterDateRange() {
  const [searchParamsState, setSearchParamsState] = useSearchParamsState();

  function handleChange(newDateRange: string) {
    setSearchParamsState({
      ...searchParamsState,
      dateRange: isDateRangeOption(newDateRange) ? newDateRange : defaultDateRangeOption,
    });
  }

  return (
    <Select value={searchParamsState.dateRange} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Zeitraum auswählen" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Zeitraum</SelectLabel>
          {dateRangeOptions.map((dateRange) => (
            <SelectItem key={dateRange} value={dateRange}>
              {dateRange}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
