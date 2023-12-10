import { Input } from "../../../components/input";
import {getTimeComparable} from "../../../helpers/getDayText";
import { useSearch } from "../../../helpers/search/use-search";
import { useMemo } from "preact/hooks";
import { useCell } from "../../../helpers/cell-state";
import { activitiesStore } from "../../../stores/activities/activities.store";
import { ActivityList } from "../activities/activityList";
import { SearchPlug } from "../../../components/plugs/search/SearchPlug";
import { searchDataValidator } from "../../../helpers/search/searchDataValidator";
import {orderBy} from "@cmmn/core";

export const ActivitySearch = () => {
  const { query, check, setQuery } = useSearch(
    (regex) => (activity: Activity) =>
      regex.test(searchDataValidator(activity.title)) ||
      regex.test(searchDataValidator(activity.author))
  );
  const activities = useCell(() => activitiesStore.Activities);
  const filtered = useMemo(() => {
    return orderBy(orderBy(orderBy(
      activities.filter(check),
    (x) => x.title, true),
    (x) => getTimeComparable(x.start), true),
    (x) => x.day);
  }, [activities, check]);
  return (
    <div flex column gap={5} className="h-full" style={{marginBottom: 40}}>
      <h1>поиск</h1>
      <Input
        style={{ margin: "20px 0" }}
        placeholder="Название мероприятия"
        value={query}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      {filtered.length > 0 ? (
        <ActivityList activities={filtered} searchQuery={query} showDate/>
      ) : (
        <SearchPlug
          title={"Ничего не найдено"}
          text={"Попробуйте найти мероприятие по названию или по ведущему"}
        ></SearchPlug>
      )}
    </div>
  );
};
