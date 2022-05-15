import React, { useState } from "react";
import { MapComponent } from "./map";
import { useCellState } from "../../helpers/cell-state";
import { mapStore } from "src/stores/map.store";

export function MapPage() {
  const [schema] = useCellState(() => mapStore.Schema);
  if (!schema) return <></>;
  return <MapComponent items={[]} image={schema} onSelect={null} />;
}
