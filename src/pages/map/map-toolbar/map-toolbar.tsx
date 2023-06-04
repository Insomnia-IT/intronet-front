import { useState } from "preact/hooks";
import { CloseButton, Expander } from "@components";
import { locationsStore } from "@stores/locations.store";
import styles from "./map-toolbar.module.css";
import { Location } from "@components/Location";
import { SvgIcon } from "@icons";
import { useHistoryState } from "../../routing";

export type MapToolbarProps = {
  id: string;
  onClose();
};

export function MapToolbar(props: MapToolbarProps) {
  const [ expanded, setExpanded ] = useHistoryState("mapToolbarExapnded", false);

  const location = locationsStore.db.get(props.id);

  return (
    <>
      <div className={ expanded ? styles.expandedToolbar : styles.toolbar }>
        <CloseButton
          onClick={ () => {
            setExpanded(false);
            props.onClose();
          } }/>

        <div
          className={ expanded ? styles.down : styles.up }
          onClick={ () => setExpanded((x) => !x) }
        >
          <Expander/>
        </div>
        <Location location={ location } expanded={ expanded }/>
      </div>
    </>
  );
}
