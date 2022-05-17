import React, { useEffect, useState } from "react";
import {
  Block,
  Box,
  Button,
  Card,
  Columns,
  Dropdown,
  Form,
  Icon,
} from "react-bulma-components";
import {
  useChangeLocationMutation,
  useGetLocationsQuery,
} from "src/api/locations";
import { useCellState } from "src/helpers/cell-state";
import { locationsStore } from "src/stores/locations.store";

export function MapPage() {
  const [query, setQuery] = useState("");

  const [locations] = useCellState(() => locationsStore.FullLocations);

  useEffect(() => {
    console.log(locations);
  }, [locations]);

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
          <Dropdown
            label={
              <Form.Input
                placeholder="Поиск локаций по списку"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
              />
            }
          >
            <Dropdown.Item renderAs="a" value="Sdasda">
              asdasdasd
            </Dropdown.Item>
          </Dropdown>
          <Box>
            <Form.Field kind="addons">
              <Form.Control fullwidth>
                <Form.Input
                  placeholder="Поиск локаций по списку"
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                />
                {/* <div className="dropdown is-active">
                  <div className="dropdown-trigger">
                    <div className="field">
                      <p className="control is-expanded has-icons-right">
                        <input
                          className="input"
                          type="search"
                          placeholder="Search..."
                        />
                        <span className="icon is-small is-right">
                          <i className="fas fa-search"></i>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                      <a href="#" className="dropdown-item">
                        Dropdown item
                      </a>
                      <a href="#" className="dropdown-item">
                        Other dropdown item
                      </a>
                      <hr className="dropdown-divider" />
                      <a href="#" className="dropdown-item">
                        With a divider
                      </a>
                    </div>
                  </div>
                </div>{" "} */}
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
            <Button.Group>
              <Button rounded onClick={() => setQuery("Столовые")}>
                <span>Столовые</span>
                <Icon align="left" size="large">
                  <i className="mdi mdi-food-apple" />
                </Icon>
              </Button>
              <Button rounded onClick={() => setQuery("Туалеты")}>
                <span>Туалеты</span>
                <Icon align="left" size="large">
                  <i className="mdi mdi-toilet" />
                </Icon>
              </Button>
              <Button rounded onClick={() => setQuery("Показы")}>
                <span>Показы</span>
                <Icon align="left" size="large">
                  <i className="mdi mdi-camera-iris" />
                </Icon>
              </Button>
            </Button.Group>
            {locations.map((location) => (
              <Block>{location.id} asd</Block>
            ))}
          </Box>
          <Button onClick={() => setQuery("Test location")}>
            Test location
          </Button>
        </Block>
      </Columns.Column>
    </>
  );
}
