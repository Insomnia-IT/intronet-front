import {geoConverter} from "@helpers/geo";
import {useEffect, useState} from "preact/hooks";

export const UserLocation = () => {
  const [point, setPoint] = useState<Point>(null)
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
  return <g transform={`translate(${point.X},${point.Y})`}>
    <circle r='80' fill="var(--chineese-cafe)"/>
    <text font-size="80" alignment-baseline="middle" text-anchor="middle" fill="var(--cold-white)">Я</text>
  </g>
}
