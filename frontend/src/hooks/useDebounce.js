import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a rapidly changing value.
 * Useful for delaying search queries until the user stops typing.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Return a cleanup function that will be called every time 
    // useEffect is re-called. useEffect will only be re-called 
    // if value or delay changes.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
