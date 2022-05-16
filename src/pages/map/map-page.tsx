import React from "react";
import { MapComponent } from "./map";
import { useCellState } from "../../helpers/cell-state";
import { mapStore } from "src/stores/map.store";
import { Button, Icon } from "react-bulma-components";
import styles from "./map-page.module.css";

export function MapPage() {
  const [isMap, setIsMap, isMapCell] = useCellState(true);
  const [image] = useCellState(() =>
    isMapCell.get() ? mapStore.Map : mapStore.Schema
  );
  if (!image) return <></>;
  return (
    <>
      <MapComponent items={[]} image={image} onSelect={null} />;
      <div className={styles.layers}>
        <Button onClick={() => setIsMap(!isMap)}>
          <Icon>
            <i className="mdi mdi-layers"></i>
          </Icon>
        </Button>
      </div>
    </>
  );
}
