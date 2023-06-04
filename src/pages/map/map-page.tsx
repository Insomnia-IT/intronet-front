import { cell } from "@cmmn/cell/lib";
import { Component } from "preact";
import { Button, ButtonsBar, CloseButton } from "@components";
import { RequireAuth } from "@components/RequireAuth";
import { ModalContext } from "@helpers/AppProvider";
import { locationsStore } from "@stores/locations.store";
import { mapStore } from "@stores/map.store";
import { cellState } from "@helpers/cell-state";
import { MapComponent } from "./map";
import styles from "./map-page.module.css";
import { MapToolbar } from "./map-toolbar/map-toolbar";
import mapElementStyles from "./map-element.module.css";
import { UserMapItem } from "./user-map-item";
import { historyStateCell, useRouter } from "../routing";
import { SvgIcon } from "@icons";
import { MapIcon } from "./icons/map-icons";
import { compare } from "@cmmn/cell/lib";

export function MapPageWithRouting() {
  const { route } = useRouter();
  return <MapPage locationId={route[1]} />;
}

export class MapPage extends Component<{ locationId? }> {
  get selected(): string {
    return historyStateCell.get()["selectedMapElement"];
  }
  set selected(value: string) {
    console.log(value);
    historyStateCell.set({
      ...historyStateCell.get(),
      selectedMapElement: value,
    });
  }

  @cell
  isEditing = false;
  static contextType = ModalContext;

  componentDidMount() {
    this.selected ??= this.props.locationId;
  }

  @cell
  user = new UserMapItem();

  handleAddIconButtonClick = async () => {
    try {
      // TODO: fix class component context
      // @ts-ignore
      // const newLocation = await this.context.show<InsomniaLocation>((props) => (
      //   <LocationModal {...props} />
      // ));
      // locationsStore.addLocation(newLocation);
      // TODO: add toast
    } catch (error) {
      // TODO: add toast
    }
  };

  private locationToMapItem(x: InsomniaLocationFull) {
    return {
      figure: mapStore.Map2GeoConverter.fromGeo(x.figure as Geo),
      directionId: x.directionId,
      title: x.name,
      id: x._id,
      radius: 10,
    } as MapItem;
  }

  @cell({ compare })
  get mapItems() {
    const items = locationsStore.FullLocations
      // TODO: support polygones
      // .filter((x) => !Array.isArray(x.figure))
      .map((x) => this.locationToMapItem(x));
    return items;
  }

  state = cellState(this, {
    image: () => mapStore.Map2,
    items: () => this.mapItems,
    isEditing: () => this.isEditing,
    selected: () => this.selected,
  });

  render() {
    if (!this.state.image) return <></>;
    return (
      <div className={styles.container}>
        <MapComponent
          isMovingEnabled={this.state.isEditing}
          selected={this.state.selected}
          image={this.state.image}
          onClick={() => {}}
          onSelect={(x: MapItem) => {
            if (x === this.user) {
              this.selected = null;
            } else {
              this.selected = x?.id;
            }
          }}
        />
        <CloseButton />
        <ButtonsBar at="bottom">
          <Button type="vivid">
            <SvgIcon id="#search" size="14px" />
          </Button>
          <Button type="vivid">
            <SvgIcon id="#bookmark" size="14px" />
            мои места
          </Button>
        </ButtonsBar>

        {/*<ButtonsBar at="right">*/}
        {/*  <Button type="frame" className={styles.mapButton}>*/}
        {/*    <SvgIcon id="#plus" size="14px" />*/}
        {/*  </Button>*/}
        {/*  <Button type="frame" className={styles.mapButton}>*/}
        {/*    <SvgIcon id="#minus" size="14px" />*/}
        {/*  </Button>*/}
        {/*</ButtonsBar>*/}
        {/*<LocationSearch onSelect={this.selectLocation} />*/}
        <ButtonsBar at="left">
          {/*<Button*/}
          {/*  type="frame"*/}
          {/*  onClick={() => {*/}
          {/*    this.isMap = !this.isMap;*/}
          {/*    this.isEditing = false;*/}
          {/*    this.localChanges.clear();*/}
          {/*  }}*/}
          {/*  className={styles.mapButton}*/}
          {/*>*/}
          {/*  <SvgIcon id="#magic" size="24px" />*/}
          {/*</Button>*/}

          <RequireAuth>
            <Button
              aria-label="Start edit"
              onClick={() => {
                if (this.isEditing) {
                  this.saveLocations();
                }
                this.isEditing = !this.isEditing;
              }}
            >
              {this.state.isEditing ? <SvgIcon id="#ok-circle" /> : <SvgIcon id="#edit" />}
            </Button>
            <Button
              onClick={this.handleAddIconButtonClick}
              aria-label="Add location"
            >
              <SvgIcon id="#plus" />
            </Button>
          </RequireAuth>
        </ButtonsBar>
        {this.state.selected ? (
          <MapToolbar
            id={this.state.selected}
            onClose={() => (this.selected = null)}
          />
        ) : null}
      </div>
    );
  }

  componentWillUnmount() {
    locationsStore.applyChanges();
  }

  selectLocation = (location: InsomniaLocationFull) => {
    this.selected = location._id;
  };


  saveLocations() {
    locationsStore.applyChanges();
  }
}
