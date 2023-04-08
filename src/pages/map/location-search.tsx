import {Component, createRef} from "preact";
import { cellState } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { cell } from "@cmmn/cell/lib";
import {SvgIcon} from "@icons";
import styles from "./map-page.module.css";
import { Chip } from "@components/chip/chip";
import { ObservableList } from "@cmmn/cell/lib";
import { scheduleStore } from '@stores';
import {MapIcon} from "./icons/map-icons";

export class LocationSearch extends Component<{
  onSelect(location: InsomniaLocationFull);
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

  root = createRef<HTMLDivElement>();

  render() {
    return (
      <div
        ref={this.root}
        className={this.state.opened ? styles.searchOpened : styles.search}
      >
        <div className="flex">
            <SvgIcon id="#search"/>
            {this.state.opened && (
              <input
                className="flex-1"
                value={this.state.query}
                placeholder="Поиск мест и мероприятий"
                onChange={(e) => (this.query = e.currentTarget.value)}
              />
            )}
            {this.state.query && (
              <SvgIcon id="#x" onClick={() => (this.query = "")}/>
            )}
          <div className={styles.close} onClick={() => (this.opened = false)}>
            <SvgIcon id="#close" />
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
                    this.query = undefined;
                  }}
                >
                  <svg
                    style={{ width: 30, height: 30 }}
                    viewBox="-20 -20 40 40"
                  >
                    <MapIcon id={x.directionId}/>
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
