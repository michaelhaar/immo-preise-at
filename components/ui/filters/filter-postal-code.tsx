'use client';

import { useSearchParamsState } from '@/hooks/use-search-params-state';
import { sanitizePostalCodesString } from '@/lib/utils';
import { useState } from 'react';
import { TextareaAutosize } from '../textarea';

export function FilterPostalCode() {
  const [searchParams, setSearchParams] = useSearchParamsState();
  const [pendingPostalCodes, setPendingPostalCodes] = useState(sanitizePostalCodesString(searchParams.postalCodes));

  function handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    setSearchParams({
      ...searchParams,
      postalCodes: sanitizePostalCodesString(e.target.value),
    });
  }

  return (
    <TextareaAutosize
      placeholder="Suche"
      value={pendingPostalCodes}
      onChange={(e) => setPendingPostalCodes(sanitizePostalCodesString(e.target.value))}
      onBlur={handleBlur}
    />
  );
}
