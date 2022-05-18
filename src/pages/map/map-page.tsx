import React from "react";
import { MapComponent, MapItem } from "./map";
import { cellState } from "../../helpers/cell-state";
import { mapStore } from "src/stores/map.store";
import { Button, Icon } from "react-bulma-components";
import styles from "./map-page.module.css";
import { Observable } from "cellx-decorators";
import { LocationFull, locationsStore } from "../../stores/locations.store";
import { MapToolbar } from "./map-toolbar";
import { compare } from "../../helpers/compare";

export function MapPage() {
  return (
    <MapPageInternal
      locations={locationsStore.FullLocations as LocationFull[]}
      onChange={(location) => locationsStore.Locations.update(location)}
    />
  );
}

export class MapPageInternal extends React.PureComponent<{
  locations: LocationFull[];
  onChange(location);
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
        : { x: x.x, y: x.y },
      icon: x.image,
      title: x.name,
      id: x.id,
      radius: 10,
      location: x,
    } as MapItem;
  }

  get mapItems() {
    return this.props.locations.map((x) => this.locationToMapItem(x));
  }

  componentDidUpdate(
    prevProps: Readonly<{ locations: LocationFull[]; onChange(location) }>,
    prevState: Readonly<{}>,
    snapshot?: any
  ) {
    if (!compare(prevProps.locations, this.props.locations)) {
      this.setState({ items: this.mapItems });
    }
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
          image={this.state.image}
          onSelect={(x) => (this.selected = x)}
          onClick={this.onClick}
        />
        <div className={styles.layers}>
          <Button onClick={() => (this.isMap = !this.isMap)}>
            <Icon>
              <svg
                width="26"
                height="23"
                viewBox="0 0 26 23"
                fill="none"
                stroke="#808080"
                strokeWidth="1.6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1.7998 13.1499L13.1285 21.5499L24.1998 13.1499" />
                <path d="M13.1285 17.35L1.7998 9.04032L13.1285 1.25L24.1998 9.04032L13.1285 17.35Z" />
              </svg>
            </Icon>
          </Button>
        </div>
        {this.state.selected && <MapToolbar item={this.state.selected} />}
      </>
    );
  }

  onClick = (point) => {
    if (!this.selected) return;
    // XXX: testing location change
    // const location = this.selected.location;
    // if (this.isMap) {
    //   const geo = mapStore.MapGeoConverter.toGeo(point);
    //   Object.assign(location, geo);
    // } else {
    //   Object.assign(location, point);
    // }
    // this.props.onChange(location);
    // this.setState({ items: this.mapItems });
  };
}
