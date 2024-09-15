'use client';

import { useDebouncedState } from '@/hooks/use-debounced-state';
import { useSearchParamsState } from '@/hooks/use-search-params-state';
import { sanitizePostalCodesString } from '@/lib/utils';
import { useEffect } from 'react';
import { TextareaAutosize } from '../textarea';

export function FilterPostalCode() {
  const [searchParams, setSearchParams] = useSearchParamsState();
  const [pendingPostalCodes, debouncedPostalCodes, setPendingPostalCodes] = useDebouncedState(
    sanitizePostalCodesString(searchParams.postalCodes),
    1000,
  );

  useEffect(() => {
    setSearchParams({
      ...searchParams,
      postalCodes: debouncedPostalCodes,
    });
  }, [setSearchParams, debouncedPostalCodes, searchParams]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  return (
    <TextareaAutosize
      placeholder="Bsp.: 8010, 8020, 8045"
      value={pendingPostalCodes}
      onChange={(e) => setPendingPostalCodes(sanitizePostalCodesString(e.target.value))}
      onKeyDown={handleKeyDown}
    />
  );
}
