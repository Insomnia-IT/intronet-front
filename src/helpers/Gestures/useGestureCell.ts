import { useCallback, useState } from "preact/hooks";
import { GestureCell } from "./gesture";
import { useCell } from "@helpers/cell-state";

export const useGestureCell = () => {
  const [gestureCell, setGestureCell] = useState<GestureCell | undefined>(
    undefined
  );

  const setRef = useCallback((div: HTMLElement | undefined) => {
    if (div) {
      const gestureCell = new GestureCell(div);
      setGestureCell(gestureCell);
    } else {
      setGestureCell(undefined);
    }
  }, []);

  const gesture = useCell(gestureCell);

  return {
    setRef,
    gesture,
  }
}
