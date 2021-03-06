import { AddIcon, CheckIcon, EditIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { Computed, Observable } from "cellx-decorators";
import React from "react";
import { LocationModal } from "src/components";
import { RequireAuth } from "src/components/RequireAuth";
import { ModalContext } from "src/helpers/AppProvider";
import { locationsStore } from "src/stores/locations.store";
import { mapStore } from "src/stores/map.store";
import { cellState } from "../../helpers/cell-state";
import { getIconByDirectionId } from "./icons/icons";
import { LayersIcon } from "./icons/LayersIcon";
import { LocationSearch } from "./location-search";
import { MapComponent } from "./map";
import styles from "./map-page.module.css";
import { MapToolbar } from "./map-toolbar/map-toolbar";
import mapElementStyles from "./map-element.module.css";
import { UserMapItem } from "./user-map-item";
import { useParams } from "react-router-dom";

export function MapPageWithRouting() {
  const { locationId } = useParams<{ locationId }>();
  return <MapPage locationId={locationId} />;
}

export class MapPage extends React.PureComponent<{ locationId? }> {
  @Observable
  isMap = true;
  @Observable
  selected: number;
  @Observable
  isEditing = false;
  static contextType = ModalContext;

  componentDidMount() {
    this.selected = +this.props.locationId;
  }

  @Observable
  user = new UserMapItem();

  handleAddIconButtonClick = async () => {
    try {
      // TODO: fix class component context
      // @ts-ignore
      const newLocation = await this.context.show<InsomniaLocation>((props) => (
        <LocationModal {...props} />
      ));
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
      icon: this.isMap ? (
        getIconByDirectionId(x.directionId)
      ) : this.isEditing ? (
        <>
          <circle
            r={15}
            className={mapElementStyles.hoverCircle}
            strokeWidth="2"
            fill="transparent"
            stroke="red"
          ></circle>
        </>
      ) : null,
      title: x.name,
      id: x.id,
      radius: 10,
    } as unknown as MapItem;
  }

  @Computed
  get mapItems() {
    const items = locationsStore.FullLocations.map((x) =>
      this.locationToMapItem(x)
    );
    if (this.isMap && this.user.isLoaded) {
      return items.concat([this.user]);
    }
    return items;
  }

  state = cellState(this, {
    image: () => (this.isMap ? mapStore.Map2 : mapStore.Schema),
    items: () => this.mapItems,
    isEditing: () => this.isEditing,
    selected: () => this.mapItems.find((x) => x.id === this.selected),
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
          onSelect={(x: MapItem) => {
            if (x === this.user) {
              this.selected = null;
            } else {
              this.selected = x?.id;
            }
          }}
        />
        <LocationSearch onSelect={this.selectLocation} />
        <div className={styles.buttons}>
          <IconButton
            icon={<LayersIcon />}
            onClick={() => {
              this.isMap = !this.isMap;
              this.isEditing = false;
              this.localChanges.clear();
            }}
            aria-label="Change view"
          />

          <RequireAuth>
            <IconButton
              icon={this.isEditing ? <CheckIcon /> : <EditIcon />}
              onClick={() => {
                if (this.isEditing) {
                  this.saveLocations();
                }
                this.isEditing = !this.isEditing;
              }}
              aria-label="Start edit"
            />
            <IconButton
              icon={<AddIcon />}
              onClick={this.handleAddIconButtonClick}
              aria-label="Add location"
            />
          </RequireAuth>
        </div>
        {this.state.selected ? (
          <MapToolbar
            id={this.state.selected.id}
            onClose={() => (this.selected = null)}
          />
        ) : null}
      </div>
    );
  }

  componentWillUnmount() {
    this.localChanges.clear();
  }

  selectLocation = (location: InsomniaLocation) => {
    this.selected = location.id;
  };

  private localChanges = new Map<number, InsomniaLocation>();

  updateLocation = (x: MapItem) => {
    const location = {
      ...(this.localChanges.get(x.id) ?? locationsStore.Locations.get(x.id)),
    };
    if (this.isMap) {
      // @ts-ignore
      Object.assign(location, mapStore.Map2GeoConverter.toGeo(x.point));
    } else {
      // @ts-ignore
      Object.assign(location, { x: x.point.X, y: x.point.Y });
    }
    this.localChanges.set(location.id, location);
  };

  saveLocations() {
    const toUpdate = Array.from(this.localChanges.values());
    this.localChanges.clear();
    for (let location of toUpdate) {
      locationsStore.Locations.update(location);
    }
  }
}
