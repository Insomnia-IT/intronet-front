import React from "react";
import {
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { cellState } from "src/helpers/cell-state";
import { locationsStore } from "../../stores/locations.store";
import { cell } from "@cmmn/cell/lib";
import { getIconByDirectionId } from "./icons/icons";
import styles from "./map-page.module.css";
import { Chip } from "../../components/chip/chip";
import { ObservableList } from "@cmmn/cell/lib";
import { Close } from "src/components/close";
import { scheduleStore } from "../../stores/schedule.store";

export class LocationSearch extends React.PureComponent<{
  onSelect(location: InsomniaLocation);
}> {
  @cell
  choosedTags = new ObservableList<Tag>();

  @cell
  query: string;

  @cell
  opened: boolean = false;

  state = cellState(this, {
    opened: () => this.opened,
    query: () => this.query,
    tags: () => locationsStore.Tags.toArray(),
    choosedTags: () => this.choosedTags.toArray(),
    locations: () =>
      locationsStore.FullLocations.filter(
        (x) =>
          this.choosedTags.length === 0 ||
          x.tags.some((tag) => this.choosedTags.some((y) => y.id === tag.id))
      ).filter(filterLocations(this.query)),
  });

  root = React.createRef<HTMLDivElement>();

  render() {
    return (
      <div
        ref={this.root}
        className={this.state.opened ? styles.searchOpened : styles.search}
      >
        <Flex direction="row">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              bg={"white"}
              value={this.state.query}
              placeholder="Поиск мест и мероприятий"
              onChange={(e) => (this.query = e.target.value)}
            />
            {this.state.query && (
              <InputRightElement onClick={() => (this.query = "")}>
                <CloseIcon color="gray.200" />
              </InputRightElement>
            )}
          </InputGroup>
          <div className={styles.close} onClick={() => (this.opened = false)}>
            <Close />
          </div>
        </Flex>
        {this.state.opened && (
          <>
            <HStack
              className={styles.chips}
              padding="16px 0"
              align="center"
              flexDirection="row"
              flex="auto 0 0"
              overflowX="scroll"
            >
              {this.state.tags.map((tag) => {
                return (
                  <Chip
                    key={tag.id}
                    className={styles.chip}
                    activeClassName={styles.chipActive}
                    onClick={() => {
                      this.choosedTags.includes(tag)
                        ? this.choosedTags.remove(tag)
                        : this.choosedTags.push(tag);
                    }}
                    active={this.state.choosedTags.includes(tag)}
                  >
                    {tag.name}
                  </Chip>
                );
              })}
            </HStack>
            <Flex
              direction="column"
              bg="white"
              flex="1"
              minHeight="0"
              overflowY="auto"
            >
              {this.state.locations.map((x) => (
                <Flex
                  key={x.id}
                  padding="16px 0"
                  gap="10px"
                  alignItems="center"
                  onClick={() => {
                    this.props.onSelect(x);
                    this.opened = false;
                  }}
                >
                  <svg
                    style={{ width: 30, height: 30 }}
                    viewBox="-20 -20 40 40"
                  >
                    {getIconByDirectionId(x.directionId)}
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
  };
}

function filterLocations(query: string) {
  const regEx = new RegExp(query, "iu");
  return (location: InsomniaLocationFull) => {
    const simpleResult =
      location.name?.match(regEx) ||
      location.description?.match(regEx) ||
      location.menu?.match(regEx);
    if (simpleResult) {
      return true;
    }
    const schedules = scheduleStore.db
      .toArray()
      .filter((x) => x.locationId === location.id);
    return schedules
      .flatMap((x) => x.audiences)
      .flatMap((x) => x.elements)
      .some(
        (x) =>
          x.name?.match(regEx) ||
          x.speaker?.match(regEx) ||
          x.description?.match(regEx)
      );
  };
}
