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
import { dateRangeOptions } from '@/lib/constants';
import { parseDateRange } from '@/lib/utils';
import { parseAsString, useQueryState } from 'nuqs';

export function FilterDateRange() {
  const [unsafeDateRange, setDateRange] = useQueryState('dateRange', parseAsString);
  const dateRange = parseDateRange(unsafeDateRange);

  return (
    <Select value={dateRange} onValueChange={(newDateRange) => setDateRange(newDateRange)}>
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
