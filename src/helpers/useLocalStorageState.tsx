import { useCallback, useEffect, useState } from "preact/compat";

export const useLocalStorageState = <T,>(key: string, initialValue?: T) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (localStorage.getItem(key)) {
      setValue(JSON.parse(localStorage.getItem(key)) as unknown as T);
    } else if (initialValue) {
      localStorage.setItem(key, JSON.stringify(initialValue));
      setValue(initialValue);
    }
  }, [initialValue, key]);

  const setLocalStorageState = useCallback(
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    },
    [key]
  );

  return [value, setLocalStorageState, initialValue] as const;
};
