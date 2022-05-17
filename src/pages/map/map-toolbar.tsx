import { MapItem } from "./map";
import React from "react";
import styles from "./map-toolbar.module.css";

export function MapToolbar(props: { item: MapItem }) {
  return <div className={styles.toolbar}>{props.item.title}</div>;
}
