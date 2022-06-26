import { AddIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import { Observable } from "cellx-decorators";
import React from "react";
import { LocationModal } from "src/components";
import { RequireAuth } from "src/components/RequireAuth";
import { ModalContext } from "src/helpers/AppProvider";
import { locationsStore } from "src/stores/locations.store";
import { mapStore } from "src/stores/map.store";
import { cellState } from "../../helpers/cell-state";
import { LayersIcon } from "./icons/LayersIcon";
import { LocationSearch } from "./location-search";
import { MapComponent } from "./map";
import styles from "./map-page.module.css";
import { MapToolbar } from "./map-toolbar/map-toolbar";

export class MapPage extends React.PureComponent {
  @Observable
  isMap = true;
  @Observable
  selected: MapItem = null;
  static contextType = ModalContext;

  handleAddIconButtonClick = async () => {
    try {
      // TODO: fix class component context
      // @ts-ignore
      const newLocation = await this.context.show<InsomniaLocationFull>(
        (props) => <LocationModal {...props} />
      );
      locationsStore.addLocation(newLocation);
      // TODO: add toast
    } catch (error) {
      // TODO: add toast
    }
  };

  private locationToMapItem(x: InsomniaLocationFull) {
    return {
      point: this.isMap
        ? mapStore.Map2GeoConverter.fromGeo({
            lat: x.lat,
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
    image: () => (this.isMap ? mapStore.Map2 : mapStore.Schema),
    items: () => this.mapItems,
    selected: () => this.selected,
  });

  render() {
    if (!this.state.image) return <></>;
    return (
      <div className={styles.container}>
        <MapComponent
          items={this.state.items}
          isMovingEnabled={false}
          selected={this.state.selected}
          image={this.state.image}
          onClick={console.log}
          onChange={this.updateLocation}
          onSelect={(x) => (this.selected = x)}
        />
        <LocationSearch onSelect={this.selectLocation} />
        <Box pos="absolute" right="1" zIndex="1" bottom="50%">
          <IconButton
            icon={<LayersIcon />}
            onClick={() => (this.isMap = !this.isMap)}
            aria-label="Change view"
          />
        </Box>

        <RequireAuth>
          <Box pos="absolute" right="12" zIndex="1" bottom="12">
            <IconButton
              size="lg"
              isRound
              icon={<AddIcon />}
              onClick={this.handleAddIconButtonClick}
              aria-label="Add location"
            />
          </Box>
        </RequireAuth>
        {this.state.selected && (
          <MapToolbar
            id={this.state.selected.id}
            onClose={() => (this.selected = null)}
          />
        )}
      </div>
    );
  }

  selectLocation = (location: InsomniaLocation) => {
    const mapItem = this.state.items.find((x) => x.id == location.id);
    this.selected = mapItem;
  };

  updateLocation = (x: MapItem) => {
    const location = locationsStore.Locations.get(x.id);
    if (this.isMap) {
      // @ts-ignore
      Object.assign(location, mapStore.Map2GeoConverter.toGeo(x.point));
    } else {
      // @ts-ignore
      Object.assign(location, { x: x.point.X, y: x.point.Y });
    }
    locationsStore.Locations.update(location);
  };
}
