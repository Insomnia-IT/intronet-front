import { useCallback, useEffect, useState } from "react";

export const useLocalStorageState = <T,>(key: string, initialValue?: T) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (localStorage.getItem(key)) {
      setValue(localStorage.getItem(key) as unknown as T);
    } else if (initialValue) {
      localStorage.setItem(key, JSON.stringify(initialValue));
      setValue(initialValue);
    }
  }, []);

  const setLocalStorageState = useCallback((newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  }, []);

  return [value, setLocalStorageState, initialValue] as const;
};
