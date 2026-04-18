import { useEffect, useState } from "react";

export const useDebounce = (value, timer) => {
  const [debouncedValue, setDebouncedValue] = useState();

  useEffect(() => {
    const timerRef = setTimeout(() => {
      setDebouncedValue(value);
    }, timer);

    return () => {
      clearTimeout(timerRef);
    };
  }, [value]);

  return debouncedValue;
};
