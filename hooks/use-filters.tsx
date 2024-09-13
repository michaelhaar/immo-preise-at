import { parseDateRange, sanitizePostalCodesString } from '@/lib/utils';
import { parseAsString, useQueryState } from 'nuqs';

export function useFilters() {
  const [unsafePostalCodes] = useQueryState('postalCode', parseAsString.withDefault(''));
  const [unsafeDateRange] = useQueryState('dateRange', parseAsString);
  const dateRange = parseDateRange(unsafeDateRange);

  const now = new Date();
  const fromDate = new Date();
  fromDate.setUTCHours(0, 0, 0, 0);
  const toDate = new Date();
  toDate.setUTCHours(23, 59, 59, 999);

  switch (dateRange) {
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
      const _exhaustiveCheck: never = dateRange;
      break;
  }

  return {
    postalCodes: sanitizePostalCodesString(unsafePostalCodes).split(' ').filter(Boolean),
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString(),
  };
}