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
import { LocationMenu } from "./location/location-menu";
import { SearchInput } from "@components/input/search-input";
import { goTo } from "../routing";

export function MapPageWithRouting() {
  const router = useLocationsRouter();

  const isEditing = useCell(() => locationsStore.isEdit);
  const isMoving = useCell(() => locationsStore.isMoving);
  const sheets = getMapSheets(
    router.locationId,
    () => router.goTo(["map"]),
    () => locationsStore.setSelectedId(null)
  );
  if (router.route[1] == "menu")
    return <LocationMenu id={router.route[2] as string} />;
  return (
    <PageLayout
      withTapBar
      dropStyles
      design="full"
      className={styles.full}
      hideSearchDeps={[router.locationId]}
    >
      <div className={styles.header}>
        <SearchInput
          placeholder="Площадка"
          style={{ background: "var(--white)" }}
          onFocus={() => router.goTo([router.route[0], "search"])}
        />
        <SvgIcon
          id="#bookmark"
          style={{
            color: "var(--vivid)",
          }}
          size={32}
          onClick={() => goTo("/bookmarks/locations")}
        />
      </div>
      <div className={styles.container}>
        <MapComponent />
        {isEditing ? (
          <div class={styles.editBar}>
            <Button
              type="textSimple"
              class="colorVivid"
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
  if (selected.length === 1) return <Location id={selected[0]._id} />;
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
      return <LocationSearch />;
    case undefined:
      return null;
  }
};
