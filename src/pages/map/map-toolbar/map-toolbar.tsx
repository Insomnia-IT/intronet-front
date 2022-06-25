import React, { useState } from "react";
import { locationsStore } from "src/stores/locations.store";
import styles from "./map-toolbar.module.css";
import { ScheduleComponent } from "./schedule";
import { Close } from "../../../components/close";
import { Expander } from "../../../components/expander";

export type MapToolbarProps = {
  id: number | string;
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
        <div className={styles.content}>
          <div className={styles.header}>{location.name}</div>
          <div className={styles.description}>
            {location.description || "Описание локации"}
          </div>
          {expanded && <ScheduleComponent locationId={location.id} />}
        </div>
      </div>
    </>
  );
}
