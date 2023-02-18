import React, { useState } from "react";
import { Close, Expander, Location } from "src/components";
import { locationsStore } from "src/stores/locations.store";
import styles from "./map-toolbar.module.css";

export type MapToolbarProps = {
  id: string;
  onClose();
};

export function MapToolbar(props: MapToolbarProps) {
  const [expanded, setExpanded] = useState(false);

  const location = locationsStore.Locations.get(props.id);

  return (
    <>
      <div className={expanded ? styles.expandedToolbar : styles.toolbar}>
        <div className={styles.close} onClick={props.onClose}>
          <Close />
        </div>
        <div
          className={expanded ? styles.down : styles.up}
          onClick={() => setExpanded((x) => !x)}
        >
          <Expander />
        </div>
        <Location location={location} expanded={expanded} />
      </div>
    </>
  );
}
