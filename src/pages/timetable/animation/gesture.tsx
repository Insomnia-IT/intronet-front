import { Cell } from "@cmmn/cell/lib";
import { DragHandler } from "../../map/handlers/dragHandler";

export const Gesture = new Cell<
  | {
      path: EventTarget[];
      direction: "x" | "y";
      shift: number;
    }
  | undefined
>(undefined);

function listenGesture() {
  let shift: { x: number; y: number } = undefined;
  let path: EventTarget[] | undefined;
  const onDown = (e: PointerEvent) => {
    shift = { x: 0, y: 0 };
    path = e.composedPath();
    document.body.setPointerCapture(e.pointerId);
    document.body.addEventListener("pointermove", onMove, {
      passive: true,
    });
  };
  const onMove = (e: PointerEvent) => {
    if (!shift) return;
    shift.x += e.movementX;
    shift.y += e.movementY;
    const current = Gesture.get();
    if (current?.direction == "y" || Math.atan2(shift.y, shift.x) > 10) {
      Gesture.set({
        path,
        direction: "y",
        shift: shift.y,
      });
    }
    if (current?.direction == "x" || Math.atan2(shift.y, shift.x) < 0.1) {
      Gesture.set({
        path,
        direction: "x",
        shift: shift.x,
      });
    }
  };
  const onUp = (e: PointerEvent) => {
    shift = undefined;
    document.body.releasePointerCapture(e.pointerId);
    document.body.removeEventListener("pointermove", onMove);
    Gesture.set(undefined);
  };
  document.body.addEventListener("pointerdown", onDown, { capture: true });

  document.body.addEventListener("pointerup", onUp, { passive: true });
}

listenGesture();
