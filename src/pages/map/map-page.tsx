import { Button, ButtonsBar, CloseButton, Sheet } from "@components";
import { RequireAuth } from "@components/RequireAuth";
import { locationsStore } from "@stores/locations.store";
import { useCell } from "@helpers/cell-state";
import { useMemo, useState } from "preact/hooks";
import { MapComponent } from "./map";
import styles from "./map-page.module.css";
import { RoutePath } from "../routing";
import { SvgIcon } from "@icons";
import { useLocationsRouter } from "./hooks/useLocationsRouter";
import { LocationSearch } from "./search/location-search";
import { Location } from "./location/location";

export function MapPageWithRouting() {
  const router = useLocationsRouter();
  const selected: string = useCell(() => {
    const location =
      locationsStore.findByName(decodeURIComponent(router.query.name)) ??
      locationsStore.FullLocations.find((x) => x._id === router.route[1]);
    return location?._id;
  }, [router.query.name, router.route[1]]);
  const setSelected = (id) => {
    router.goTo(["map", id].filter((x) => x) as RoutePath, {}, true);
  };
  const [isEditing, setIsEditing] = useState(false);
  const sheets = useMemo(
    () =>
      getMapSheets(
        router.locationId,
        () => router.goTo(["map"]),
        () => setSelected(null)
      ),
    [router.locationId]
  );

  return (
    <div className={styles.container}>
      <MapComponent
        isMovingEnabled={isEditing}
        selected={selected}
        onSelect={(x: MapItem) => setSelected(x?.id)}
      />
      <CloseButton />
      <ButtonsBar at="bottom">
        <Button type="vivid" goTo="/map/search">
          <SvgIcon id="#search" size="14px" />
        </Button>
        <Button type="vivid" goTo="/bookmarks/locations">
          <SvgIcon id="#bookmark" size="14px" />
          мои места
        </Button>
      </ButtonsBar>
      <ButtonsBar at="left">
        <RequireAuth>
          <Button
            aria-label="Start edit"
            onClick={async () => {
              if (isEditing) {
                await locationsStore.applyChanges();
              }
              setIsEditing((x) => !x);
            }}
          >
            {isEditing ? <SvgIcon id="#ok-circle" /> : <SvgIcon id="#edit" />}
          </Button>
          <Button
            onClick={this.handleAddIconButtonClick}
            aria-label="Add location"
          >
            <SvgIcon id="#plus" />
          </Button>
        </RequireAuth>
      </ButtonsBar>
      <Sheet
        height={router.locationId !== "search" ? "50%" : "100%"}
        noShadow
        shadowType={"localShadow"}
        children={sheets}
        onClose={() => router.goTo(["map"])}
      />
    </div>
  );
}

const getMapSheets = (
  locationId: string,
  onSearchClose: () => void,
  onPageClose: () => void
) => {
  switch (locationId) {
    case "search":
      return (
        <>
          <LocationSearch />
          <CloseButton onClick={onSearchClose} />
        </>
      );
    case undefined:
      return null;
    default:
      return (
        <>
          <Location id={locationId} />
          <CloseButton onClick={onPageClose} />
        </>
      );
  }
};
