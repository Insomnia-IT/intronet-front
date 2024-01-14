import { Input } from "@components/input";
import { SearchPlug } from "@components/plugs/search/SearchPlug";
import { useCell } from "@helpers/cell-state";
import { LocationList } from "../location/location-list";
import {searchStore} from "@stores/search.store";
import {useEffect} from "preact/hooks";

export const LocationSearch = () => {
  const query = useCell(searchStore.query)
  const locations = useCell(searchStore.filteredLocations);
  useEffect(() => () => searchStore.query.set(''), []);

  return (
    <div flex column gap={5} className="h-full">
      <h1>поиск</h1>
      <Input
        style={{ margin: "20px 0" }}
        placeholder="Площадка"
        value={query}
        onInput={searchStore.onInput}
      />
      {locations.length > 0 ? (
        <LocationList locations={locations} searchQuery={query} />
      ) : (
        <SearchPlug
          title={"Ничего не найдено"}
          text={"Попробуйте найти площадку по названию"}
        ></SearchPlug>
      )}
    </div>
  );
};
