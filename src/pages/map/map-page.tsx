import React, { useMemo } from "react";
import { MapComponent } from "./map";
import { cellState, useCellState } from "../../helpers/cell-state";
import { mapStore } from "src/stores/map.store";
import { Button, Icon } from "react-bulma-components";
import styles from "./map-page.module.css";
import { Observable } from "cellx-decorators";

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

export class MapPage2 extends React.PureComponent {
  @Observable
  isMap = true;

  state = cellState(this, {
    image: () => (this.isMap ? mapStore.Map : mapStore.Schema),
  });

  render() {
    if (!this.state.image) return <></>;
    return (
      <>
        <MapComponent items={[]} image={this.state.image} onSelect={null} />;
        <div className={styles.layers}>
          <Button onClick={() => (this.isMap = !this.isMap)}>
            <Icon>
              <i className="mdi mdi-layers"></i>
            </Icon>
          </Button>
        </div>
      </>
    );
  }
}
