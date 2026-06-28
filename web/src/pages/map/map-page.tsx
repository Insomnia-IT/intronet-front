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
import { goTo, routerCell } from "../routing";
import { useRef } from "preact/hooks";
import { searchStore } from "@stores/search.store";
import {
  searchDataValidator,
  safeDecodeURIComponent,
} from "@helpers/search-normalize";

function isSameMapFilterChip(active: string, label: string) {
  const a = searchDataValidator(active).toLowerCase();
  const b = searchDataValidator(label).toLowerCase();
  return !!a && a === b;
}

/**
 * Страница карты с роутингом по локациям и нижним листом.
 *
 * Разметка:
 * - `styles.container` — обёртка на весь экран под карту и оверлеи (фиксированная высота вьюпорта).
 * - Слева `ButtonsBar`: редактирование и добавление только при авторизации (`RequireAuth`);
 *   кнопка сброса вида карты (`aria-label="Reset map view"`) всегда доступна и вызывает
 *   `MapComponent.resetView()` через ref — без неё пользователь остаётся с сохранённым
 *   масштабом/сдвигом из `localStorage` (`transform`).
 */
export function MapPageWithRouting() {
  const router = useLocationsRouter();
  const mapRef = useRef<MapComponent | null>(null);
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
        {/* ref: вызов resetView с кнопки сброса вида (вне MapComponent) */}
        <MapComponent
          onLongTap={locationsStore.startAddLocation}
          ref={(instance) => (mapRef.current = instance)}
        />
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
              {/* Сброс вида: очистка transform в localStorage и initTransform под размер контейнера */}
              <Button
                type="frameOrange"
                aria-label="Reset map view"
                onClick={() => mapRef.current?.resetView()}
              >
                <SvgIcon id="#x" />
              </Button>
            </ButtonsBar>
            <MapSearchBottomBar />
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

/** Нижняя панель: лупа открывает поиск, чипы — переход по `groupLink` (`?direction=`). */
function MapSearchBottomBar() {
  const router = useLocationsRouter();
  const isEditing = useCell(() => locationsStore.isEdit);
  const activeDirection = useCell(() =>
    safeDecodeURIComponent(routerCell.get().query.direction)
  );
  const groupChips = useCell(() => {
    const counts = new Map<string, number>();
    for (const loc of locationsStore.Locations) {
      const g = loc.groupLink?.trim();
      if (!g) continue;
      counts.set(g, (counts.get(g) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 24)
      .map(([gl]) => gl);
  });

  if (isEditing) return null;
  if (["search", "add", "edit"].includes(router.locationId ?? "")) return null;

  return (
    <div className={styles.mapBottomBar}>
      <div className={styles.mapBottomBarInner}>
        <button
          type="button"
          className={styles.searchFab}
          aria-label="Поиск по карте"
          onClick={() => {
            searchStore.query.set("");
            router.goTo(["map", "search"]);
          }}
        >
          <SvgIcon
            id="#search"
            stroke-width={1.6}
            style={{ color: "var(--white)" }}
            size={18}
          />
        </button>
        <div className={styles.chipsScroll}>
          {groupChips?.map((label) => (
            <button
              key={label}
              type="button"
              className={
                isSameMapFilterChip(activeDirection, label)
                  ? `${styles.mapChip} ${styles.mapChipActive}`
                  : styles.mapChip
              }
              onClick={() =>
                isSameMapFilterChip(activeDirection, label)
                  ? goTo(["map"], {})
                  : goTo(["map"], { direction: label })
              }
            >
              {label.length > 22 ? `${label.slice(0, 20)}…` : label}
            </button>
          ))}
        </div>
      </div>
    </div>
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
