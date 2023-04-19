import { useCallback, useEffect, useState } from "preact/hooks";
import { EventEmitter } from "@cmmn/cell/lib";

const localStorageChangeEmitter = new EventEmitter<Record<string, any>>();
export const useLocalStorageState = <T,>(key: string, initialValue?: T) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (localStorage.getItem(key)) {
      setValue(JSON.parse(localStorage.getItem(key)) as unknown as T);
    } else if (initialValue) {
      localStorage.setItem(key, JSON.stringify(initialValue));
      setValue(initialValue);
    }
    return localStorageChangeEmitter.on(key, setValue);
  }, [initialValue, key]);

  const setLocalStorageState = useCallback(
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
      localStorageChangeEmitter.emit(key, newValue);
    },
    [key]
  );

  return [value, setLocalStorageState, initialValue] as const;
};

/**
 * Синхронизирует куки в document.cookie со стейтом в контексте,
 * что вызывает триггер ререндера, который иначе не происходит без вызова функции,
 * поскольку куки устанавливаются в обход setCookieState
 */
export const useCookies = (
  key: string,
  factory: () => string = () => undefined
) => {
  const cookies = readCookies();
  const [value, setValue] = useState(cookies[key] ?? factory());
  const setCookie = useCallback(
    (value) => {
      const cookies = readCookies();
      cookies[key] = value;
      document.cookie = Object.entries(cookies)
        .map((arr) => arr.join("="))
        .join(";");
      setValue(value);
    },
    [setValue]
  );
  return [value, setCookie];
};

function readCookies() {
  return Object.fromEntries(
    document.cookie
      .split(";")
      .map((x) => x.trim())
      .map((x) => x.split("=").map((x) => x.toLowerCase()))
  );
}
