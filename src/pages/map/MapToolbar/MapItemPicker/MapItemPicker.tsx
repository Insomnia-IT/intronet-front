import React, { useState } from "react";
import { Button, Dropdown, Form, Icon } from "react-bulma-components";
import { useCellState } from "src/helpers/cell-state";
import { locationsStore } from "src/stores/locations.store";

export type MapItemPickerProps = {
  item?: MapItem;
  locations?: MapItem[];
  onChange?: (oldItem: MapItem, newItem: MapItem) => void;
};

export const MapItemPicker = ({ item, onChange }: MapItemPickerProps) => {
  const [locations, setLocations] = useState([]);

  return (
    <Form.Field kind="addons">
      <Form.Control fullwidth>
        <Dropdown
          onChange={(newItem) => onChange(item, newItem)}
          value={item}
          placeholder="Выберите локацию"
          label={item && item.title}
        >
          {locations &&
            // @ts-ignore
            locations.map((location) => (
              <Dropdown.Item renderAs="a" value={location}>
                {location.title}
              </Dropdown.Item>
            ))}
        </Dropdown>
        <Icon align="left" size="large">
          <i className="mdi mdi-magnify" />
        </Icon>
      </Form.Control>
      <Form.Control>
        <Button onClick={() => onChange(item, null)}>
          <Icon align="left" size="large">
            <i className="mdi mdi-close" />
          </Icon>
        </Button>
      </Form.Control>
    </Form.Field>
  );
};
