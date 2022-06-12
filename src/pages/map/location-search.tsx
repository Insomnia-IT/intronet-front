import React from "react";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { cellState } from "src/helpers/cell-state";
import { locationsStore } from "../../stores/locations.store";
import { Observable } from "cellx-decorators";

export class LocationSearch extends React.PureComponent<{
  onSelect(location: InsomniaLocation);
}> {
  @Observable
  query: string;

  state = cellState(this, {
    query: () => this.query,
    locations: () =>
      locationsStore.FullLocations.filter(filterLocations(this.query)),
  });

  render() {
    return (
      <>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input bg={"white"} onChange={(e) => (this.query = e.target.value)} />
        </InputGroup>
        <Flex direction="column" bg="white">
          {this.state.query &&
            this.state.locations.map((x) => (
              <div key={x.id} onClick={() => this.props.onSelect(x)}>
                {x.name}
              </div>
            ))}
        </Flex>
      </>
    );
  }
}

function filterLocations(query: string) {
  const regEx = new RegExp(query);
  return (location: InsomniaLocationFull) => {
    return location.name.match(regEx);
  };
}
