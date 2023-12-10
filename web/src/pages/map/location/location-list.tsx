import { FunctionalComponent } from "preact";
import { useCallback, useState } from "preact/hooks";
import { useCell } from "../../../helpers/cell-state";
import { GestureCell } from "../../../helpers/Gestures";
import { LocationSmall } from "./location-small";

export const LocationList: FunctionalComponent<{
  locations: InsomniaLocation[];
  searchQuery?: string;
}> = ({locations, searchQuery}) => {
  const [ gestureCell, setGestureCell ] = useState<GestureCell | undefined>(
    undefined
  );
  const setRef = useCallback((div: HTMLDivElement | undefined) => {
    if (div) {
      const gestureCell = new GestureCell(div);
      setGestureCell(gestureCell);
    } else {
      setGestureCell(undefined);
    }
  }, []);
  const gesture = useCell(gestureCell);
  return (
    <div flex column ref={ setRef }>
      { locations.map((l) => (
        <LocationSmall
          location={ l }
          key={ l._id }
          gesture={ gesture }
          searchQuery={ searchQuery }
        />
      )) }
    </div>
  );
}
