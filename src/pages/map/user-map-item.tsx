import { EventEmitter } from "cellx";
import { mapStore } from "../../stores/map.store";
import React from "react";

export class UserMapItem extends EventEmitter implements MapItem {
  icon: JSX.Element = (
    <circle r={5} fill="#224382" stroke="white" strokeWidth="2"></circle>
  );
  id = -1;
  point: { X; Y };
  radius = 0;
  title: string = "";
  isLoaded = false;

  constructor() {
    super();
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((e) => {
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
