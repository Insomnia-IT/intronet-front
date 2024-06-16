import { PageLayout } from "@components/PageLayout";
import { Button, ButtonsBar, CloseButton, Sheet } from "@components";
import { RequireAuth } from "@components/RequireAuth";
import { locationsStore } from "@stores";
import { useCell } from "@helpers/cell-state";
import { LocationAdd } from "./location/location-add";
import { LocationEdit } from "./location/location-edit";
import { MapComponent } from "./map";
import styles from "./map-page.module.css";
import { SvgIcon } from "@icons";
import { useLocationsRouter } from "./hooks/useLocationsRouter";
import { LocationSearch } from "./search/location-search";
import { Location } from "./location/location";

export function MapPageWithRouting() {
  const router = useLocationsRouter();

  const isEditing = useCell(() => locationsStore.isEdit);
  const isMoving = useCell(() => locationsStore.isMoving);
  const sheets = getMapSheets(
    router.locationId,
    () => router.goTo(["map"]),
    () => locationsStore.setSelectedId(null)
  );
  return (
    <PageLayout
      withTapBar
      dropStyles
      favoritesRoute="/bookmarks/locations"
      searchLabel="Площадка"
      design="full"
      className={styles.full}
      search={LocationSearch}
      searchStyle={{ background: "var(--white)" }}
      hideSearchDeps={[router.locationId]}
      headerStyle={styles.header}
    >
      <div className={styles.container}>
        <MapComponent />
        {isEditing ? (
          <div class={styles.editBar}>
            <Button
              type="textSimple"
              class="colorOrange"
              onClick={() => {
                locationsStore.discardChanges();
                locationsStore.isEdit = false;
              }}
            >
              отменить
            </Button>
            <Button
              type="textSimple"
              class="colorElBlue"
              onClick={async () => {
                await locationsStore.applyChanges();
                locationsStore.isEdit = false;
              }}
            >
              готово
            </Button>
          </div>
        ) : (
          <>
            <ButtonsBar at="left">
              <RequireAuth>
                <Button
                  type="frameOrange"
                  aria-label="Start edit"
                  onClick={() =>
                    (locationsStore.isEdit = !locationsStore.isEdit)
                  }
                >
                  {isEditing ? (
                    <SvgIcon id="#ok-circle" />
                  ) : (
                    <SvgIcon id="#edit" />
                  )}
                </Button>
                <Button
                  type="frameOrange"
                  onClick={() => locationsStore.startAddLocation()}
                  aria-label="Add location"
                >
                  <SvgIcon id="#plus" />
                </Button>
              </RequireAuth>
            </ButtonsBar>
          </>
        )}
        <Sheet
          height={
            ["add", "edit", "search"].includes(router.locationId)
              ? "100%"
              : isMoving
              ? "auto"
              : "50%"
          }
          noShadow
          style={{
            pointerEvents: "none",
          }}
          shadowType={"localShadow"}
          children={sheets}
          onClose={() =>
            isMoving ? (locationsStore.isMoving = false) : router.goTo(["map"])
          }
        />
      </div>
    </PageLayout>
  );
}

const getMapSheets = (
  locationId: string,
  onSearchClose: () => void,
  onPageClose: () => void
) => {
  const selected = useCell(() => locationsStore.selected);
  if (selected.length === 1)
    return (
      <>
        <Location id={selected[0]._id} />
        <CloseButton onClick={onPageClose} />
      </>
    );
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
  }
};
