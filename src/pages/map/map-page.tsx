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

export class MapPage extends React.PureComponent<{
  locations?: LocationFull[];
}> {
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
      icon: "",
      title: x.name,
      id: x.id,
      radius: 10,
    } as MapItem;
  }

  get locations() {
    return (this.props.locations ?? locationsStore.FullLocations).map((x) =>
      this.locationToMapItem(x)
    );
  }

  state = cellState(this, {
    image: () => (this.isMap ? mapStore.Map : mapStore.Schema),
    items: () => this.locations,
    selected: () => this.selected,
  });

  render() {
    if (!this.state.image) return <></>;
    console.log(this.state.items);
    return (
      <>
        <MapComponent
          items={this.state.items}
          isMovingEnabled={adminApi.isAdmin}
          image={this.state.image}
          onClick={console.log}
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
}
