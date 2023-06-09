import { Cell } from "@cmmn/cell";
import {ChangeEvent} from "preact/compat";
import {useCallback, useEffect, useRef} from "preact/hooks";

export function useForm<T>(cell: Cell<Partial<T>>){
  const ref = useRef<HTMLFormElement>();
  const onChange = useCallback((ev: ChangeEvent) => {
    const formData = new FormData(ref.current);
    const result = {} as Partial<T>;
    formData.forEach((value,key) => {
      result[key] = value;
    })
    cell.set(result);
  }, []);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.addEventListener('change', onChange, {});
    return () => ref.current?.removeEventListener('change', onChange);
  }, [ref.current])

  return ref;
}
