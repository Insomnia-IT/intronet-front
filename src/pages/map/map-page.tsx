import { Observable } from "cellx-decorators";
import React, { useState } from "react";
import { Button, Icon } from "react-bulma-components";
import { locationsStore } from "src/stores/locations.store";
import { mapStore } from "src/stores/map.store";
import { cellState, useCellState } from "../../helpers/cell-state";
import { MapComponent } from "./map";
import styles from "./map-page.module.css";
import { MapToolbar } from "./MapToolbar";

export function MapPageFunctions() {
  const [selected, setSelected] = useState<MapItem>(null);
  const [isMap, setIsMap, isMapCell] = useCellState(true);
  const [image] = useCellState(() =>
    isMapCell.get() ? mapStore.Map : mapStore.Schema
  );
  if (!image) return <></>;
  return (
    <>
      <MapComponent items={[]} image={image} onSelect={setSelected} />;
      <div className={styles.layers}>
        <Button onClick={() => setIsMap(!isMap)}>
          <Icon>
            <i className="mdi mdi-layers"></i>
          </Icon>
        </Button>
      </div>
      <MapToolbar item={selected} />
    </>
  );
}

export class MapPage extends React.PureComponent<{
  locations?: InsomniaLocationFull[];
}> {
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
        : { x: x.x, y: x.y },
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
    return (
      <>
        {/* <MapComponent
          items={this.state.items}
          image={this.state.image}
          onSelect={(x) => (this.selected = x)}
        /> */}
        <div className={styles.layers}>
          <Button onClick={() => (this.isMap = !this.isMap)}>
            <Icon>
              <i className="mdi mdi-layers"></i>
            </Icon>
          </Button>
        </div>
        <MapToolbar
          item={this.state.selected}
          items={this.state.items}
          onChange={(oldItem, newItem) => console.log(newItem)}
        />
      </>
    );
  }
}
