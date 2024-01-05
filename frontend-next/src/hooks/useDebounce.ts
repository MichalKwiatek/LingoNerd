import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState<T | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
