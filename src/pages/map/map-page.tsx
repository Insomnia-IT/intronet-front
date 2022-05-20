import React, { useState } from "react";
import { MapComponent, MapItem } from "./map";
import { cellState, useCellState } from "../../helpers/cell-state";
import { mapStore } from "src/stores/map.store";
import { Button, Icon } from "react-bulma-components";
import styles from "./map-page.module.css";
import { Observable } from "cellx-decorators";
import { LocationFull, locationsStore } from "../../stores/locations.store";
import { MapToolbar } from "./map-toolbar";
import { adminApi } from "../../api/admin";

export class MapPage extends React.PureComponent {
  @Observable
  isMap = true;
  @Observable
  selected: MapItem = null;

  private locationToMapItem(x: LocationFull) {
    return {
      point: this.isMap
        ? mapStore.MapGeoConverter.fromGeo({
            lat: x.lat,
            lng: x.lng,
          })
        : { X: x.x, Y: x.y },
      icon: x.image,
      title: x.name,
      id: x.id,
      radius: 10,
    } as MapItem;
  }

  get mapItems() {
    return locationsStore.FullLocations.map((x) => this.locationToMapItem(x));
  }

  state = cellState(this, {
    image: () => (this.isMap ? mapStore.Map : mapStore.Schema),
    items: () => this.mapItems,
    selected: () => this.selected,
  });

  render() {
    if (!this.state.image) return <></>;
    console.log(this.state.items);
    return (
      <>
        <MapComponent
          items={this.state.items}
          isMovingEnabled={true}
          image={this.state.image}
          onClick={console.log}
          onChange={this.updateLocation}
          onSelect={(x) => (this.selected = x)}
        />
        <div className={styles.layers}>
          <Button onClick={() => (this.isMap = !this.isMap)}>
            <Icon>
              <i className="mdi mdi-layers"></i>
            </Icon>
          </Button>
        </div>
        {this.state.selected && <MapToolbar item={this.state.selected} />}
      </>
    );
  }

  updateLocation = (x: MapItem) => {
    const location = locationsStore.Locations.get(x.id);
    if (this.isMap) {
      Object.assign(location, mapStore.MapGeoConverter.toGeo(x.point));
    } else {
      Object.assign(location, { x: x.point.X, y: x.point.Y });
    }
    locationsStore.Locations.update(location);
  };
}
