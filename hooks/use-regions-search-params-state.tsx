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

// export function useFiltersFromSearchParamsState() {
//   const [searchParams] = useSearchParamsState();

//   const now = new Date();
//   const fromDate = new Date();
//   fromDate.setUTCHours(0, 0, 0, 0);
//   const toDate = new Date();
//   toDate.setUTCHours(23, 59, 59, 999);

//   switch (searchParams.dateRange) {
//     case '7T':
//       fromDate.setDate(now.getDate() - 7);
//       break;
//     case '1M':
//       fromDate.setMonth(now.getMonth() - 1);
//       break;
//     case '3M':
//       fromDate.setMonth(now.getMonth() - 3);
//       break;
//     case '6M':
//       fromDate.setMonth(now.getMonth() - 6);
//       break;
//     case '1J':
//       fromDate.setFullYear(now.getFullYear() - 1);
//       break;
//     default:
//       const _exhaustiveCheck: never = searchParams.dateRange;
//       break;
//   }

//   return {
//     postalCodes: searchParams.postalCodes.replace(',', ' ').split(' ').filter(Boolean),
//     fromDate: fromDate.toISOString(),
//     toDate: toDate.toISOString(),
//   };
// }
