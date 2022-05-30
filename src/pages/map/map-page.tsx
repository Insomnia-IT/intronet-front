import { Observable } from "cellx-decorators";
import React from "react";
import { Button, Icon } from "react-bulma-components";
import { locationsStore } from "src/stores/locations.store";
import { mapStore } from "src/stores/map.store";
import { cellState } from "../../helpers/cell-state";
import { MapComponent } from "./map";
import styles from "./map-page.module.css";
import { MapToolbar } from "./map-toolbar/map-toolbar";

export class MapPage extends React.PureComponent {
  @Observable
  isMap = true;
  @Observable
  selected: MapItem = null;

  private locationToMapItem(x: InsomniaLocationFull) {
    return {
      point: this.isMap
        ? mapStore.MapGeoConverter.fromGeo({
            lat: x.lat,
            // @ts-ignore
            lng: x.lng,
          })
        : { X: x.x, Y: x.y },
      icon: x.image,
      title: x.name,
      id: x.id,
      radius: 10,
    } as unknown as MapItem;
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
    return (
      <div className={styles.container}>
        <MapComponent
          items={this.state.items}
          isMovingEnabled={true}
          selected={this.state.selected}
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
        {this.state.selected && (
          <MapToolbar
            id={this.state.selected.id}
            onClose={() => (this.selected = null)}
          />
        )}
      </div>
    );
  }

  updateLocation = (x: MapItem) => {
    const location = locationsStore.Locations.get(x.id);
    if (this.isMap) {
      // @ts-ignore
      Object.assign(location, mapStore.MapGeoConverter.toGeo(x.point));
    } else {
      // @ts-ignore
      Object.assign(location, { x: x.point.X, y: x.point.Y });
    }
    locationsStore.Locations.update(location);
  };
}
