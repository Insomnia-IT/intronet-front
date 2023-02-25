import React from "react";
import { cellState } from "src/helpers/cell-state";
import { locationsStore } from "../../stores/locations.store";
import { cell } from "@cmmn/cell/lib";
import { getIconByDirectionId } from "./icons/icons";
import styles from "./map-page.module.css";
import { Chip } from "../../components/chip/chip";
import { ObservableList } from "@cmmn/cell/lib";
import { scheduleStore } from "../../stores/schedule.store";
import { Icons } from "src/icons";

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
          x.tags.some((tag) => this.choosedTags.some((y) => y._id === tag._id))
      ).filter(filterLocations(this.query)),
  });

  root = React.createRef<HTMLDivElement>();

  render() {
    return (
      <div
        ref={this.root}
        className={this.state.opened ? styles.searchOpened : styles.search}
      >
        <div className="flex">
            <Icons.Search/>
            <input
              className="flex-1"
              value={this.state.query}
              placeholder="Поиск мест и мероприятий"
              onChange={(e) => (this.query = e.target.value)}
            />
            {this.state.query && (
              <Icons.Cancel onClick={() => (this.query = "")}/>
            )}
          <div className={styles.close} onClick={() => (this.opened = false)}>
            <Icons.Close />
          </div>
        </div>
        {this.state.opened && (
          <>
            <div className={styles.chips}
            >
              {this.state.tags.map((tag) => {
                return (
                  <Chip
                    key={tag._id}
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
            </div>
            <div className="flex column">
              {this.state.locations.map((x) => (
                <div className="flex"
                  key={x._id}
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
                </div>
              ))}
            </div>
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
      .filter((x) => x.locationId === location._id);
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
