import {useMemo, useState} from "preact/hooks";

export function useSearch<T>(checker: (regex: RegExp) => (item: T) => boolean){
  const [query, setQuery] = useState<string | undefined>(undefined);
  const check = useMemo<(item: T) => boolean>(() => {
    if (!query) return () => true;
    try {
      const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
      return checker(regex);
    } catch (e){
      return () => false;
    }
  }, [query]);
  return {query, check, setQuery};
}
