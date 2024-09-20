'use client';

import { stringArrayParser, stringArraySerializer, useSearchParamsState } from './use-search-params-state';

export function useRegionsSearchParamsState() {
  return useSearchParamsState({
    name: 'region',
    parser: stringArrayParser,
    serializer: stringArraySerializer,
    debounceInMs: 100,
  });
}
