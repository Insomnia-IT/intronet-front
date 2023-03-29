import React, { useState } from "preact/compat";
import { Expander } from "@components";
import { locationsStore } from "@stores/locations.store";
import styles from "./map-toolbar.module.css";
import {Location} from "@components/Location";
import {SvgIcon} from "@icons";

export type MapToolbarProps = {
  id: string;
  onClose();
};

export function MapToolbar(props: MapToolbarProps) {
  const [expanded, setExpanded] = useState(false);

  const location = locationsStore.db.get(props.id);

  return (
    <>
      <div className={expanded ? styles.expandedToolbar : styles.toolbar}>
        <div className={styles.close} onClick={props.onClose}>
          <SvgIcon id="#close" />
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
