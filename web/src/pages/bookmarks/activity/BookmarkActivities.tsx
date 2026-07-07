import { useCell } from "../../../helpers/cell-state";
import { bookmarksStore } from "../../../stores/bookmarks.store";
import { coerceHour, getTimeComparable, isInTimePeriod } from "../../../helpers/getDayText";
import { ActivityList } from "../../activities/activities/activityList";
import { BookmarkPlug } from "../../../components/plugs/bookmark/BookmarkPlug";
import { orderBy } from "@cmmn/core";
import { useMemo } from "preact/hooks";
import { useBookmarksRouter } from "../hooks/useBookmarksRouter";
import { activityFiltersStore } from "../../../stores/activities";
import { Tag, Tags } from "@components";

export const BookmarkActivities = () => {
  const items = useCell(() => bookmarksStore.Activities);
  const days = useCell(() => activityFiltersStore.days);
  const times = useCell(() => activityFiltersStore.times);
  const { day, time, setDay, setTime } = useBookmarksRouter();

  const activities = useMemo(() => {
    const numberTime = Number(time);
    const filtered = items
      .filter((activity) => activity.day === day)
      .filter((activity) =>
        coerceHour(numberTime)
          ? isInTimePeriod(+activity.start.split(":")[0], numberTime)
          : true
      );
    return orderBy(filtered, (x) => getTimeComparable(x.start));
  }, [items, day, time]);

  if (items.length === 0) {
    return (
      <BookmarkPlug
        text={[
          `Добавить мероприятие в избранное можно в разделе неАнимация.`,
          `Нажмите на карточку мероприятия в списке — откроется подробная информация и кнопка «Добавить в избранное».`,
          `Или свайпните мероприятие прямо в расписании.`,
        ]}
      />
    );
  }

  return (
    <>
      <div flex gap={4} column style={{ margin: "0 0 16px 0" }}>
        <Tags tagsList={days}>
          {({ key, value }) => (
            <Tag
              selected={key == day}
              key={key}
              style={{ textAlign: "center", padding: "15.5px 16px" }}
              onClick={() => setDay(+key)}
            >
              {value}
            </Tag>
          )}
        </Tags>
        <Tags tagsList={times}>
          {({ key, value }) => (
            <Tag
              selected={key == time}
              key={key}
              style={{ textAlign: "center", padding: "15.5px 16px" }}
              onClick={() => setTime(+key)}
            >
              {value}
            </Tag>
          )}
        </Tags>
      </div>
      <ActivityList activities={activities} />
    </>
  );
};
