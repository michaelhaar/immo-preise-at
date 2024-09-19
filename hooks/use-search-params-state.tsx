'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SetStateAction, useCallback, useRef, useState } from 'react';

export function useSearchParamsState<T>({
  name,
  parser,
  serializer,
  debounceInMs,
}: {
  name: string;
  parser: (strValueFromSearchParams: string) => T;
  serializer: (value: T) => string;
  debounceInMs: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValueInternal] = useState(parser(searchParams.get(name) ?? ''));
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const pushSearchParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, serializer(value));
    router.push(pathname + '?' + params.toString());
  }, [searchParams, value, router, pathname, serializer, name]);

  const setValue = (newValue: SetStateAction<T>) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      pushSearchParams();
    }, debounceInMs);

    setValueInternal(newValue);
  };

  return [value, setValue] as const;
}

export function stringSerializer(value: string) {
  return encodeURI(value);
}

export function stringParser(value: string) {
  return decodeURI(value);
}

export function stringArraySerializer(values: string[]) {
  return values.map(stringSerializer).join('+');
}

export function stringArrayParser(value: string) {
  return value.split('+').map(stringParser);
}
