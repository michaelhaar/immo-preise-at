'use client';

import { defaultDateRangeOption } from '@/lib/constants';
import { isDateRangeOption } from '@/lib/utils';
import { stringParser, stringSerializer, useSearchParamsState } from './use-search-params-state';

export function useDateRangeSearchParamsState() {
  return useSearchParamsState({
    name: 'dateRange',
    parser: dateRangeParser,
    serializer: stringSerializer,
    debounceInMs: 100,
  });
}

function dateRangeParser(value: string | null) {
  const parsedValue = stringParser(value);
  return isDateRangeOption(parsedValue) ? parsedValue : defaultDateRangeOption;
}
