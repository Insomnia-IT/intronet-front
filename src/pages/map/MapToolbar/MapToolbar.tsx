import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { MapItemPicker } from "./MapItemPicker";

export type MapToolbarProps = {
  item?: MapItem;
  items?: MapItem[];
  onChange?: (oldItem: MapItem, newItem: MapItem) => void;
};

export function MapToolbar({ item, items, onChange }: MapToolbarProps) {
  return (
    <SimpleGrid
      columns={{
        sm: 1,
        md: 3,
        lg: 4,
      }}
    >
      <Box position="sticky" top="0" width="100%">
        <MapItemPicker item={item} items={items} onChange={onChange} />
      </Box>
    </SimpleGrid>
  );
}
