import React, {useEffect, useRef} from "react";
import {MapHandler} from "./handlers/map.handler";
import {useCellState} from "../../helpers/cell-state";
import {Cell} from "cellx";

export function MapComponent(props: MapProps) {

  const handler = new Cell<MapHandler>(null);
  const [transform] = useCellState(() => handler.get()?.Transform.get());

  const container = useRef<HTMLDivElement>();
  useEffect(() => {
    const h = new MapHandler(container.current);
    handler.set(h);
    return () => h.dispose();
  }, []);

  return <div ref={container} style={{
    transform: transform?.ToString('css'),
    transformOrigin: 'left top',
    userSelect: 'none',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    willChange: 'transform'
  }}>
    <img src={props.url}
         style={{
           pointerEvents: 'none',
           position: 'absolute',
           maxWidth: 'initial',
           userSelect: 'none',
           width: props.width,
           height: props.height
         }}
    />
    <svg>

    </svg>
  </div>;
}

type MapProps = {
  items: {
    point: { x; y; };
  }[];
  url: string;
  width: number;
  height: number;
}
