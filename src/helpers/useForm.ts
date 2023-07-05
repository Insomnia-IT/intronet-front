import { Cell } from "@cmmn/cell";
import {ChangeEvent} from "preact/compat";
import {useCallback, useEffect, useRef} from "preact/hooks";

export function useForm<T>(cell: Cell<Partial<T>>){
  const ref = useRef<HTMLFormElement>();
  const onChange = useCallback((ev: ChangeEvent) => {
    const formData = new FormData(ref.current);
    const result = {...cell.get() ?? {}} as Partial<T>;
    formData.forEach((value,key) => {
      result[key] = value;
    })
    cell.set(result);
  }, []);
  useEffect(() => {
    return cell.on('change', e => ref.current && setValues(e.value, ref.current))
  }, [cell]);
  useEffect(() => {
    if (!ref.current) return;
    setValues(cell.get(), ref.current);
    ref.current.addEventListener('change', onChange, {});
    return () => ref.current?.removeEventListener('change', onChange);
  }, [ref.current])

  return ref;
}

function setValues(value: object, form: HTMLFormElement){
  if (!value) return;
  for (let element of Array.from(form.elements) as HTMLInputElement[]) {
    const name = element.getAttribute('name');
    if (element.value !== value[name] && value[name]){
      element.value = value[name]
      element.dispatchEvent(new Event("change"))
    }
  }
}
