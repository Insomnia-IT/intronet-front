import React from "react";
import { Block, Columns } from "react-bulma-components";
import { MapItemPicker } from "./MapItemPicker";
export type MapToolbarProps = {
  item?: MapItem;
  items?: MapItem[];
  onChange?: (oldItem: MapItem, newItem: MapItem) => void;
};

export function MapToolbar({ item, items, onChange }: MapToolbarProps) {
  return (
    <Columns.Column
      tablet={{
        size: "one-third",
      }}
      desktop={{
        size: "one-third",
      }}
    >
      <Block>
        <MapItemPicker item={item} items={items} onChange={onChange} />
      </Block>
    </Columns.Column>
  );
}
