import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import { getDayText, getTimeComparable } from "@helpers/getDayText";
import { ActivityList } from "../../activities/activities/activityList";
import { BookmarkPlug } from "@components/plugs/bookmark/BookmarkPlug";

export const BookmarkActivities = () => {
  const items = useCell(() => bookmarksStore.Activities);
  const activities = items.orderBy(x => getTimeComparable(x.start));
  const dayGroup = Array.from(new Set(items.map(item => item.day))).sort((a, b) => a - b);

  return (
    items.length > 0
      ? (
        <div flex column style={ 'gap: 24px' }>
          { dayGroup.map(day =>
            <div flex column style={ 'gap: 8px' }>
              <span className="colorMediumBlue tags">{ getDayText(day, 'full') }</span>
              <ActivityList activities={ activities.filter(activity => activity.day === day) } ></ActivityList>
            </div>) }
        </div>
      )
      : (<BookmarkPlug
        buttonTitle={ 'К расписанию неанимации' }
        text={ [
          `Добавить мероприятие в избранное можно в разделе неАнимация.`,
          `Нажмите на карточку мероприятия в списке — откроется подробная информация и кнопка «Добавить в избранное».`,
          `Или свайпните мероприятие прямо в расписании.`
        ] }
        route={ '/activities' }
      />)
  );
};
