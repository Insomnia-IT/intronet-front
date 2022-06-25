import { AddIcon, CheckIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import { Observable } from "cellx-decorators";
import React from "react";
import { LocationModal } from "src/components";
import { ModalContext } from "src/helpers/AppProvider";
import { locationsStore } from "src/stores/locations.store";
import { mapStore } from "src/stores/map.store";
import { cellState } from "../../helpers/cell-state";
import { LayersIcon } from "./icons/LayersIcon";
import { LocationSearch } from "./location-search";
import { MapComponent } from "./map";
import styles from "./map-page.module.css";
import { MapToolbar } from "./map-toolbar/map-toolbar";
import { getIconByDirectionId } from "./icons/icons";

export class MapPage extends React.PureComponent {
  @Observable
  isMap = true;
  @Observable
  selected: MapItem = null;
  @Observable
  isEditing = false;
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
        ? mapStore.Map2GeoConverter.fromGeo(x)
        : { X: x.x, Y: x.y },
      icon: this.isMap ? getIconByDirectionId(x.directionId) : null,
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
    isEditing: () => this.isEditing,
    selected: () => this.selected,
  });

  render() {
    if (!this.state.image) return <></>;
    return (
      <div className={styles.container}>
        <MapComponent
          items={this.state.items}
          isMovingEnabled={this.state.isEditing}
          selected={this.state.selected}
          image={this.state.image}
          onClick={() => {}}
          onChange={this.updateLocation}
          onSelect={(x) => (this.selected = x)}
        />
        <LocationSearch onSelect={this.selectLocation} />
        <div className={styles.buttons}>
          <IconButton
            icon={<LayersIcon />}
            onClick={() => (this.isMap = !this.isMap)}
            aria-label="Change view"
          />
          <IconButton
            icon={this.isEditing ? <CheckIcon /> : <EditIcon />}
            onClick={() => (this.isEditing = !this.isEditing)}
            aria-label="Start edit"
          />
          <IconButton
            icon={<AddIcon />}
            onClick={this.handleAddIconButtonClick}
            aria-label="Add location"
          />
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
