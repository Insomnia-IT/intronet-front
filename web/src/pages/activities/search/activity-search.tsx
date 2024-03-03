import { Input } from "@components/input";
import { useCell } from "@helpers/cell-state";
import { ActivityList } from "../activities/activityList";
import { SearchPlug } from "@components/plugs/search/SearchPlug";
import { searchStore } from "@stores/search.store";
import { useEffect } from "preact/hooks";

export const ActivitySearch = () => {
  const query = useCell(searchStore.query);
  const filtered = useCell(searchStore.filteredActivities);
  useEffect(() => () => searchStore.query.set(""), []);
  return (
    <div flex column gap={5} className="h-full" style={{ marginBottom: 40 }}>
      <h1>поиск</h1>
      <Input
        style={{ margin: "20px 0" }}
        autofocus
        placeholder="Название мероприятия"
        value={query}
        onInput={searchStore.onInput}
      />
      {filtered.length > 0 ? (
        <ActivityList activities={filtered} searchQuery={query} showDate />
      ) : (
        <SearchPlug
          title={"Ничего не найдено"}
          text={"Попробуйте найти мероприятие по названию или по ведущему"}
        ></SearchPlug>
      )}
    </div>
  );
};
