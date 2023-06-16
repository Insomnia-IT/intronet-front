import { useState } from "preact/hooks";
import {CloseButton, Expander, Sheet} from "@components";
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

  const location = props.id && locationsStore.db.get(props.id);
  if (!location)
    return null;
  return (
    <>
      <Sheet height="50%" noShadow>
        <Location location={ location } expanded={ expanded }/>
        <CloseButton onClick={props.onClose}/>
      </Sheet>
    </>
  );
}
