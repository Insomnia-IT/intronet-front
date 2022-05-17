import React, { useState } from "react";
import {
  Block,
  Button,
  Columns,
  Dropdown,
  Form,
  Icon,
} from "react-bulma-components";
export type MapToolbarProps = {
  item?: MapItem;
};
export function MapToolbar({ item }: MapToolbarProps) {
  const [query, setQuery] = useState("");

  return (
    <>
      <Columns.Column
        tablet={{
          size: "one-third",
        }}
        desktop={{
          size: "one-third",
        }}
      >
        <Block>
          <Form.Field kind="addons">
            <Form.Control>
              {
                <Dropdown
                  label={
                    <Form.Input
                      placeholder="Поиск локаций"
                      type="text"
                      value={query}
                      onChange={(event) => setQuery(event.currentTarget.value)}
                    />
                  }
                >
                  <Dropdown.Item renderAs="a" value="Sdasda">
                    Локация
                  </Dropdown.Item>
                  <Dropdown.Item renderAs="a" value="Sdasda">
                    Локация
                  </Dropdown.Item>
                  <Dropdown.Item renderAs="a" value="Sdasda">
                    Локация
                  </Dropdown.Item>
                  <Dropdown.Item renderAs="a" value="Sdasda">
                    Локация
                  </Dropdown.Item>
                  <Dropdown.Item renderAs="a" value="Sdasda">
                    Локация
                  </Dropdown.Item>
                  <Dropdown.Item renderAs="a" value="Sdasda">
                    Локация
                  </Dropdown.Item>
                  <Dropdown.Item renderAs="a" value="Sdasda">
                    Локация
                  </Dropdown.Item>
                </Dropdown>
              }
              <Icon align="left" size="large">
                <i className="mdi mdi-magnify" />
              </Icon>
            </Form.Control>
            <Form.Control>
              <Button onClick={() => setQuery("")}>
                <Icon align="left" size="large">
                  <i className="mdi mdi-close" />
                </Icon>
              </Button>
            </Form.Control>
          </Form.Field>
          {/* {locations.map((location) => (
              <Block>{location.id} asd</Block>
            ))} */}
          <Button onClick={() => setQuery("Test location")}>
            Test location
          </Button>
        </Block>
      </Columns.Column>
    </>
  );
}
