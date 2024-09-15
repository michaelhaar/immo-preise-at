import { useEffect, useState } from 'react';
/**
 * useDebouncedState can be used to debounce value updates for given delay.
 *
 * Example Usecase: You have a search field and want to load sugestions.
 * Api should only be called when last user interaction is minimum 300ms ago.
 *
 * Usage: debouncedValue is updated after 500 ms
 * const [value, debouncedValue, setValue] = useDebouncedState("", 500)
 *
 * source: https://gist.github.com/madflanderz/c296e520e7ec60f9867d89308c51a3e7
 */
export function useDebouncedState<T>(initialValue: T, delay = 300) {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
    setDebouncedValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [delay, value]);

  return [value, debouncedValue, setValue] as const;
}
