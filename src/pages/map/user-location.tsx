import {Cell} from "@cmmn/cell/lib";
import {useCell} from "@helpers/cell-state";
import {geoConverter} from "@helpers/geo";
import {useEffect, useState} from "preact/hooks";
import {TransformMatrix} from "./transform/transform.matrix";

export const UserLocation = (props: {transformCell: Cell<TransformMatrix>}) => {
  const [point, setPoint] = useState<Point>(null)
  const transform = useCell(props.transformCell);
  const scale = transform.Matrix.GetScaleFactor();
  useEffect(() => {
    navigator.geolocation.watchPosition(e => {
      const point = geoConverter.fromGeo({
        lat: e.coords.latitude,
        lon: e.coords.longitude
      });
      setPoint(point);
    })
  }, []);
  if (!point)
    return <></>
  return <g transform={`translate(${point.X},${point.Y}) scale(${1.5/scale})`}>
    <circle r='10' fill="var(--chineese-cafe)"/>
    <text font-size="10" alignment-baseline="middle" text-anchor="middle" fill="var(--cold-white)">Я</text>
  </g>
}
