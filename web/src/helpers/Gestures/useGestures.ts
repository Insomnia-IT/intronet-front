import { MutableRef, useEffect, useState } from "preact/hooks";
import { Gesture } from "./gesture";
import { useLocalStorageState } from "../useLocalStorageState";

const gestureLength = Math.min(window.innerWidth / 4, 300);

export const useGestures = (
  ref: MutableRef<HTMLElement>,
  hasBookmark: boolean,
  switchBookmark: () => void,
  gesture: Gesture
) => {
  const shift =
    gesture?.path.includes(ref.current) && gesture.shift < 0
      ? Math.max(gesture.shift, -gestureLength)
      : 0;
  const transform = `translateX(${shift}px)`;
  const iconOpacity = hasBookmark
    ? 1 - Math.abs(shift) / gestureLength
    : Math.abs(shift) / gestureLength;
  const [gestureEnd, setGestureEnd] = useState(false);
  const [userUsedGesture, setUserUsedGesture] = useLocalStorageState(
    "userUsedGesture",
    false
  );

  const state = gestureEnd
                  ? hasBookmark
                    ? "Deleting"
                    : "Adding"
                  : !!shift
                  ? "Gesture"
                  : "";

  useEffect(() => {
    if (Math.abs(shift) < gestureLength * 0.9) {
      setGestureEnd(false);
    } else {
      setGestureEnd(true);
    }

    if (!gestureEnd || gesture) return;

    setGestureEnd(false);
    switchBookmark();
  }, [gesture, shift, hasBookmark, switchBookmark, gestureEnd]);

  useEffect(() => {
    if (userUsedGesture || !state) return;
    setUserUsedGesture(true);
  }, [userUsedGesture, setUserUsedGesture, state]);

  const classNames = [shift == 0 ? "transitionOut" : ""];

  return {
    transform,
    iconOpacity,
    classNames,
    state,
    gestureLength,
    needViewDemo: !(userUsedGesture || state),
  };
}
