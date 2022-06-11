import React, { useState } from "react";
import { locationsStore } from "src/stores/locations.store";
import styles from "./map-toolbar.module.css";
import { ScheduleComponent } from "./schedule";

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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0.37793C5.57812 0.37793 0.375 5.6263 0.375 12.104C0.375 18.5817 5.57812 23.8301 12 23.8301C18.4219 23.8301 23.625 18.5817 23.625 12.104C23.625 5.6263 18.4219 0.37793 12 0.37793ZM17.7 15.1821C17.9203 15.4043 17.9203 15.7637 17.7 15.9859L15.8438 17.8536C15.6234 18.0758 15.2672 18.0758 15.0469 17.8536L12 14.7518L8.94844 17.8536C8.72812 18.0758 8.37187 18.0758 8.15156 17.8536L6.3 15.9812C6.07969 15.759 6.07969 15.3996 6.3 15.1774L9.375 12.104L6.3 9.02592C6.07969 8.80369 6.07969 8.44434 6.3 8.22211L8.15625 6.34972C8.37656 6.12749 8.73281 6.12749 8.95312 6.34972L12 9.45619L15.0516 6.35445C15.2719 6.13222 15.6281 6.13222 15.8484 6.35445L17.7047 8.22684C17.925 8.44907 17.925 8.80842 17.7047 9.03065L14.625 12.104L17.7 15.1821Z"
              fill="#CBD5E0"
            />
          </svg>
        </div>
        <div
          className={expanded ? styles.down : styles.up}
          onClick={() => setExpanded((x) => !x)}
        >
          <svg
            width="37"
            height="12"
            viewBox="0 0 37 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.45703 9.5L18.4998 3L34.5426 9.5"
              stroke="#CBD5E0"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className={styles.content}>
          <div className={styles.header}>{location.name}</div>
          <div className={styles.description}>{location.description}</div>
          {expanded && <ScheduleComponent locationId={location.id} />}
        </div>
      </div>
    </>
  );
}
