import React, { useState } from "react";
import { Expander } from "@components";
import { locationsStore } from "@stores/locations.store";
import styles from "./map-toolbar.module.css";
import {Icons} from "@icons";
import {Location} from "@components/Location";

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
          <Icons.Close />
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
