'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SetStateAction, useRef, useState } from 'react';

export function useSearchParamsState<T>({
  name,
  parser,
  serializer,
  debounceInMs,
}: {
  name: string;
  parser: (strValueFromSearchParams: string | null) => T;
  serializer: (value: T) => string;
  debounceInMs: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parsedValue = parser(searchParams.get(name));
  const [value, setValueInternal] = useState(parsedValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pushSearchParamsRef = useRef(() => {});

  pushSearchParamsRef.current = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, serializer(value));
    router.push(pathname + '?' + params.toString());
  };

  const setValue = (newValue: SetStateAction<T>) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      pushSearchParamsRef.current();
    }, debounceInMs);

    setValueInternal(newValue);
  };

  return [value, setValue, parsedValue] as const;
}

export function stringSerializer(value: string) {
  return encodeURI(value);
}

export function stringParser(value: string | null) {
  return value ? decodeURI(value) : '';
}

export function stringArraySerializer(values: string[]) {
  return values.map(stringSerializer).join('+');
}

export function stringArrayParser(value: string | null) {
  return value ? value.split('+').map(stringParser) : [];
}
