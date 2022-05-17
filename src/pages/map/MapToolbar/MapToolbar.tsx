import React, { useState } from "react";
import { Block, Button, Columns } from "react-bulma-components";
import { MapItemPicker } from "./MapItemPicker";

export type MapToolbarProps = {
  item?: MapItem;
  onChange?: (item: MapItem) => void;
};

export function MapToolbar({ item, onChange }: MapToolbarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (item: any) => {
    console.log(item);
  };

  const [locations, setLocations] = useState<MapItem[]>([
    {
      icon: "mdi mdi-layers",
      id: 1,
      point: {
        x: 1,
        y: 1,
      },
      radius: 5,
      title: "Jhtk asd",
    },
  ]);

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
        <MapItemPicker
          item={item}
          locations={locations}
          onChange={handleChange}
        />
        <Button onClick={() => setQuery("Test location")}>Test location</Button>
      </Block>
    </Columns.Column>
  );
}
