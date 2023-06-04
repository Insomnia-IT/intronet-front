import { Input } from "@components/input";
import { useMemo, useState } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import { activitiesStore } from "@stores/activities/activities.store";
import { ActivityList } from "../activities/activityList";
import { SvgIcon } from "@icons";
import { SearchPlug } from "@components/plugs/search/SearchPlug";

export const ActivitySearch = () => {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const activities = useCell(() => activitiesStore.Activities);
  const check = useMemo(() => checkActivity(query), [query]);

  const filtered = useMemo(() => activities.filter(check), [activities, check]);

  return (
    <>
      <h1>поиск</h1>
      <Input
        style={{ margin: "20px 0" }}
        placeholder="Название мероприятия"
        value={query}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      {filtered.length > 0 ? (
        <ActivityList activities={filtered} searchQuery={query} />
      ) : (
        <SearchPlug
          title={'Поиск по неанимации'}
          text={'Попробуйте найти мероприятие по названию или по ведущему'}></SearchPlug>
      )}
    </>
  );
};

const checkActivity = (query: string | undefined) => {
  if (!query) return () => true;
  const regex = new RegExp(query, "i");
  return (activity: Activity) =>
    regex.test(activity.title) ||
    regex.test(activity.author);
};
