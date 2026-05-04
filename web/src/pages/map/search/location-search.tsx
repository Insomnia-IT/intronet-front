import { Input } from "@components/input";
import { SearchPlug } from "@components/plugs/search/SearchPlug";
import { useCell } from "@helpers/cell-state";
import { LocationList } from "../location/location-list";
import { searchStore } from "@stores/search.store";
import { useEffect } from "preact/hooks";
import { PageHeader } from "@components/PageHeader/PageHeader";
import { goTo } from "../../routing";
import searchStyles from "./location-search.module.css";

export const LocationSearch = () => {
  const query = useCell(searchStore.query);
  const locations = useCell(searchStore.filteredLocations);
  const groups = useCell(searchStore.matchedLocationGroups);
  useEffect(() => () => searchStore.query.set(""), []);

  const openGroup = (groupLink: string) => {
    goTo(["map"], { direction: groupLink });
    searchStore.query.set("");
  };

  const showEmptyPlug =
    groups.length === 0 && locations.length === 0 && query.trim().length > 0;

  return (
    <div flex column gap={5} className="h-full">
      <PageHeader titleH1={"поиск"} withCloseButton />

      <Input
        autofocus
        placeholder="Площадка"
        value={query}
        onInput={searchStore.onInput}
      />

      {groups.length > 0 && (
        <div className={searchStyles.groupsBlock}>
          {groups.map((g) => (
            <button
              key={g.groupLink}
              type="button"
              className={searchStyles.groupRow}
              onClick={() => openGroup(g.groupLink)}
            >
              <span>
                <div className={searchStyles.groupRowTitle}>
                  Все «{g.groupLink}» на карте
                </div>
                <div className={searchStyles.groupRowHint}>
                  Показать все точки категории
                </div>
              </span>
              <span className={searchStyles.groupRowCount}>{g.count}</span>
            </button>
          ))}
        </div>
      )}

      {locations.length > 0 ? (
        <LocationList locations={locations} searchQuery={query} />
      ) : showEmptyPlug ? (
        <SearchPlug
          title={"Ничего не найдено"}
          text={"Попробуйте найти площадку по названию"}
        />
      ) : null}
    </div>
  );
};
