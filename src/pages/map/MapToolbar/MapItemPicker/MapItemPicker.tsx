import { Select } from "chakra-react-select";
import React from "react";

export type MapItemPickerProps = {
  item?: MapItem;
  items?: MapItem[];
  onChange?: (oldItem: MapItem, newItem: MapItem) => void;
};

export const MapItemPicker = ({
  item,
  items,
  onChange,
}: MapItemPickerProps) => {
  return (
    <Select
      placeholder="Поиск мест"
      isClearable
      closeMenuOnSelect
      value={
        item && {
          label: item.title,
          value: item,
        }
      }
      onChange={(newValue) => onChange(item, newValue.value)}
      options={
        items &&
        items.map((item) => ({
          label: item.title,
          value: item,
        }))
      }
    />
  );
};
