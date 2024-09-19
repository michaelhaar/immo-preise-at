'use client';

import { stringArrayParser, stringArraySerializer, useSearchParamsState } from './use-search-params-state';

export function useRegionsSearchParamsState() {
  return useSearchParamsState({
    name: 'regions',
    parser: stringArrayParser,
    serializer: stringArraySerializer,
    debounceInMs: 1000,
  });
}
