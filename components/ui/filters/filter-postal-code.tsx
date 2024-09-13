'use client';

import { sanitizePostalCodesString } from '@/lib/utils';
import { parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';
import { TextareaAutosize } from '../textarea';

export function FilterPostalCode() {
  const [postalCodes, setPostalCodes] = useQueryState('postalCode', parseAsString.withDefault(''));
  const [pendingPostalCodes, setPendingPostalCodes] = useState(sanitizePostalCodesString(postalCodes));

  return (
    <TextareaAutosize
      placeholder="Suche"
      value={pendingPostalCodes}
      onChange={(e) => setPendingPostalCodes(sanitizePostalCodesString(e.target.value))}
      onBlur={(e) => setPostalCodes(sanitizePostalCodesString(e.target.value))}
    />
  );
}
