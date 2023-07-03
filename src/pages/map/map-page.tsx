import { Button, ButtonsBar, CloseButton, Sheet } from "@components";
import { RequireAuth } from "@components/RequireAuth";
import { locationsStore } from "@stores/locations.store";
import { useCell } from "@helpers/cell-state";
import {useEffect, useMemo} from "preact/hooks";
import {LocationAdd} from "./location/location-add";
import {LocationEdit} from "./location/location-edit";
import { MapComponent } from "./map";
import styles from "./map-page.module.css";
import { RoutePath } from "../routing";
import { SvgIcon } from "@icons";
import { useLocationsRouter } from "./hooks/useLocationsRouter";
import { LocationSearch } from "./search/location-search";
import { Location } from "./location/location";

export function MapPageWithRouting() {
  const router = useLocationsRouter();
  const selected = useCell(() => locationsStore.selected);

  const isEditing = useCell(() => locationsStore.isEdit);
  const isMoving = useCell(() => locationsStore.isMoving);
  const sheets = useMemo(
    () =>
      getMapSheets(
        router.locationId,
        () => router.goTo(["map"]),
        () => locationsStore.setSelectedId(null)
      ),
    [router.locationId]
  );

  return (
    <div className={styles.container}>
      <MapComponent />
      {isEditing ? <div class={styles.editBar}>
        <Button type="textSimple" class="colorOrange"
                onClick={() => {
                  locationsStore.discardChanges();
                  locationsStore.isEdit = false;
                }}>отменить</Button>
        <Button type="textSimple" class="colorElBlue"
                onClick={async () => {
                  await locationsStore.applyChanges();
                  locationsStore.isEdit = false;
                }}>готово</Button>
      </div>: <>
        <CloseButton goTo="/main"/>
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
              type="frameOrange"
              aria-label="Start edit"
              onClick={() => locationsStore.isEdit = !locationsStore.isEdit}
            >
              {isEditing ? <SvgIcon id="#ok-circle" /> : <SvgIcon id="#edit" />}
            </Button>
            <Button
              type="frameOrange"
              goTo={["map", "add"]}
              aria-label="Add location"
            >
              <SvgIcon id="#plus" />
            </Button>
          </RequireAuth>
        </ButtonsBar>
      </>}
      <Sheet
        height={["add", "edit", "search"].includes(router.locationId) ? "100%" : isMoving ? "auto" : "50%"}
        noShadow
        shadowType={"localShadow"}
        children={sheets}
        onClose={() => isMoving ? locationsStore.isMoving = false : router.goTo(["map"])}
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
    case "add":
      return (
        <>
          <LocationAdd />
          <CloseButton onClick={onSearchClose} />
        </>
      );
    case "edit":
      return (
        <>
          <LocationEdit />
          <CloseButton onClick={onSearchClose} />
        </>
      );
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
