'use client';

import { dateRangeOptions, defaultDateRangeOption } from '@/lib/constants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { z } from 'zod';

const searchParamsSchema = z.object({
  postalCodes: z
    .string()
    .regex(/[0-9 ]/)
    .catch(''),
  dateRange: z.enum(dateRangeOptions).catch(defaultDateRangeOption),
});
type SearchParamsState = z.infer<typeof searchParamsSchema>;

export function useSearchParamsState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const unsafeSearchParamsObj = Object.fromEntries(searchParams.entries());
  const searchParamsObj = searchParamsSchema.parse(unsafeSearchParamsObj);

  const setSearchParamsObj = useCallback(
    (newSearchParamsObj: SearchParamsState) => {
      const newQueryString = new URLSearchParams(newSearchParamsObj).toString();
      router.push(pathname + '?' + newQueryString);
    },
    [router, pathname],
  );

  return [searchParamsObj, setSearchParamsObj] as const;
}

export function useFiltersFromSearchParamsState() {
  const [searchParams] = useSearchParamsState();

  const now = new Date();
  const fromDate = new Date();
  fromDate.setUTCHours(0, 0, 0, 0);
  const toDate = new Date();
  toDate.setUTCHours(23, 59, 59, 999);

  switch (searchParams.dateRange) {
    case '7T':
      fromDate.setDate(now.getDate() - 7);
      break;
    case '1M':
      fromDate.setMonth(now.getMonth() - 1);
      break;
    case '3M':
      fromDate.setMonth(now.getMonth() - 3);
      break;
    case '6M':
      fromDate.setMonth(now.getMonth() - 6);
      break;
    case '1J':
      fromDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      const _exhaustiveCheck: never = searchParams.dateRange;
      break;
  }

  return {
    postalCodes: searchParams.postalCodes.split(' ').filter(Boolean),
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString(),
  };
}
