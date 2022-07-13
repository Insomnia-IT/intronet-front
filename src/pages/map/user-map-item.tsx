import { EventEmitter } from "cellx";
import { mapStore } from "../../stores/map.store";
import React from "react";

export class UserMapItem extends EventEmitter implements MapItem {
  get icon(): JSX.Element {
    if (this.radius > 150) {
      return <></>;
    }
    return (
      <circle
        r={this.radius / 10}
        fill="#224382"
        opacity={50 / this.radius}
        stroke="white"
        strokeWidth="2"
      ></circle>
    );
  }
  id = -1;
  point: { X; Y };
  radius = 0;
  title: string = "";
  isLoaded = false;
  isAccurate = false;

  constructor() {
    super();
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((e) => {
        this.isAccurate = e.coords.accuracy < 50;
        this.radius = Math.max(50, e.coords.accuracy);
        this.point = mapStore.Map2GeoConverter.fromGeo({
          lat: e.coords.latitude,
          lon: e.coords.longitude,
        });
        this.isLoaded = true;
        this.emit({
          type: "change",
        });
      });
    } else {
    }
  }
}
