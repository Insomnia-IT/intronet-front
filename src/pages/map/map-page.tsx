import { cell } from "@cmmn/cell/lib";
import { Component } from "preact";
import { Button, ButtonsBar, CloseButton } from "@components";
import { RequireAuth } from "@components/RequireAuth";
import { ModalContext } from "@helpers/AppProvider";
import { locationsStore } from "@stores/locations.store";
import { mapStore } from "@stores/map.store";
import {cellState, useCell} from "@helpers/cell-state";
import {useState} from "preact/hooks";
import {MapComponent, MapProps} from "./map";
import styles from "./map-page.module.css";
import { MapToolbar } from "./map-toolbar/map-toolbar";
import mapElementStyles from "./map-element.module.css";
import { UserMapItem } from "./user-map-item";
import {historyStateCell, RoutePath, routes, useRouter} from "../routing";
import { SvgIcon } from "@icons";
import { MapIcon } from "./icons/map-icons";
import { compare } from "@cmmn/cell/lib";

export function MapPageWithRouting() {
  const { route, query, goTo } = useRouter<{name: string}>();
  const selected: string = useCell(() => {
    const location = locationsStore.findByName(decodeURIComponent(query.name))
      ?? locationsStore.FullLocations.find(x => x._id === route[1]);
    return location?._id;
  }, [query.name, route[1]]);
  console.log(selected)
  const setSelected = (id) => {
    goTo(['map', id].filter(x => x) as RoutePath, {}, true);
  };
  const [isEditing, setIsEditing] = useState(false)
  return  <div className={styles.container}>
    <MapComponent
      isMovingEnabled={isEditing}
      selected={selected}
      onSelect={(x: MapItem) => setSelected(x?.id)}
    />
    <CloseButton />
    <ButtonsBar at="bottom">
      <Button type="vivid">
        <SvgIcon id="#search" size="14px" />
      </Button>
      <Button type="vivid">
        <SvgIcon id="#bookmark" size="14px" />
        мои места
      </Button>
    </ButtonsBar>
    <ButtonsBar at="left">
      <RequireAuth>
        <Button
          aria-label="Start edit"
          onClick={async () => {
            if (isEditing) {
              await locationsStore.applyChanges();
            }
            setIsEditing(x => !x)
          }}
        >
          {isEditing ? <SvgIcon id="#ok-circle" /> : <SvgIcon id="#edit" />}
        </Button>
        <Button
          onClick={this.handleAddIconButtonClick}
          aria-label="Add location"
        >
          <SvgIcon id="#plus" />
        </Button>
      </RequireAuth>
    </ButtonsBar>
    {selected && <MapToolbar
        id={selected}
        onClose={() => setSelected(null)}
      />}
  </div>
}
