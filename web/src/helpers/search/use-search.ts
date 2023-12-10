import { useMemo, useState } from "preact/hooks";
import { searchDataValidator } from "./searchDataValidator";

export function useSearch<T>(checker: (regex: RegExp) => (item: T) => boolean) {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const validatedQuery = searchDataValidator(query);

  const check = useMemo<(item: T) => boolean>(() => {
    if (!validatedQuery) return () => true;
    try {
      const regex = new RegExp(
        validatedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      return checker(regex);
    } catch (e) {
      return () => false;
    }
  }, [validatedQuery]);

  return { query, check, setQuery };
}
