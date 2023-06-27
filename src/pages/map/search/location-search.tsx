import {useSearch} from "@helpers/use-search";
import { useMemo, useState } from "preact/hooks";
import { Input } from "@components/input";
import { SearchPlug } from "@components/plugs/search/SearchPlug";
import { useCell } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { LocationList } from "../location/location-list";

export const LocationSearch = () => {
  const {query, check, setQuery} = useSearch(regex => (location: InsomniaLocation) =>
    regex.test(location.name) || regex.test(location.directionId))
  const locations = useCell(() => locationsStore.Locations);
  const filtered = useMemo(() => locations.filter(check), [ locations, check ]);

  return (
    <div flex column gap={ 5 } className="h-full">
      <h1>поиск</h1>
      <Input
        style={ {margin: "20px 0"} }
        placeholder="Локация"
        value={ query }
        onInput={ (e) => setQuery(e.currentTarget.value) }
      />
      { filtered.length > 0 ? (
        <LocationList locations={ filtered } searchQuery={ query }/>
      ) : (
        <SearchPlug
          title={ 'Ничего не найдено' }
          text={ 'Попробуйте найти локацию по названию' }></SearchPlug>
      ) }
    </div>
  );
};
