import { Input } from "@components/input";
import { useMemo, useState } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import { activitiesStore } from "@stores/activities.store";
import { ActivityList } from "../activities/activityList";

export const ActivitySearch = () => {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const activities = useCell(() => activitiesStore.Activities);
  const check = useMemo(() => checkActivity(query), [query]);

  const filtered = useMemo(() => activities.filter(check), [activities, check]);
  console.log(filtered)
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
        <div flex column gap={4}>
          <div class="sh1 colorMediumBlue">Ничего не нашли</div>
          <div class="text colorMediumBlue">
            Попробуйте искать по другому запросу
          </div>
        </div>
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
