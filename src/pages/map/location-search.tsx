import React from "react";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { cellState } from "src/helpers/cell-state";
import { locationsStore } from "../../stores/locations.store";
import { Observable } from "cellx-decorators";
import { MapIcons } from "./icons/icons";
import styles from "./map-page.module.css";

export class LocationSearch extends React.PureComponent<{
  onSelect(location: InsomniaLocation);
}> {
  @Observable
  query: string;

  @Observable
  opened: boolean = false;

  state = cellState(this, {
    opened: () => this.opened,
    query: () => this.query,
    locations: () =>
      locationsStore.FullLocations.filter(filterLocations(this.query)),
  });

  root = React.createRef<HTMLDivElement>();

  render() {
    return (
      <div
        ref={this.root}
        className={this.state.opened ? styles.searchOpened : styles.search}
      >
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input bg={"white"} onChange={(e) => (this.query = e.target.value)} />
        </InputGroup>
        {this.state.opened && (
          <>
            <Flex direction="column" bg="white">
              {this.state.locations.map((x) => (
                <Flex
                  key={x.id}
                  onClick={() => {
                    this.props.onSelect(x);
                    this.opened = false;
                  }}
                >
                  <svg
                    style={{ width: 30, height: 30 }}
                    viewBox="-20 -20 40 40"
                  >
                    {MapIcons[x.image]}
                  </svg>
                  <div>{x.name}</div>
                </Flex>
              ))}
            </Flex>
          </>
        )}
      </div>
    );
  }

  componentDidMount() {
    document.addEventListener("click", this.setOpened, {
      capture: true,
    });
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.setOpened, {
      capture: true,
    });
  }

  setOpened = (e: PointerEvent) => {
    const path = e.composedPath();
    this.opened = path.includes(this.root.current);
    console.log(path, this.root.current, this.opened);
  };
}

function filterLocations(query: string) {
  const regEx = new RegExp(query);
  return (location: InsomniaLocationFull) => {
    return location.name.match(regEx);
  };
}
