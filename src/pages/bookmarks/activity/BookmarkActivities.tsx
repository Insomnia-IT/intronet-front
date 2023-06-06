import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import { getDayText } from "@helpers/getDayText";
import { ActivityList } from "../../activities/activities/activityList";
import { BookmarkPlug } from "@components/plugs/bookmark/BookmarkPlug";

export const BookmarkActivities = () => {
  const items = useCell(() => bookmarksStore.Activities);
  const dayGroup = Array.from(new Set(items.map(item => item.day))).sort((a, b) => a - b);

  return (
    items.length > 0
      ? (
        <div flex column style={ 'gap: 24px' }>
          { dayGroup.map(day =>
            <div flex column style={ 'gap: 8px' }>
              <span className="colorMediumBlue tags">{ getDayText(day, 'full') }</span>
              <ActivityList activities={ items } filters={ {day: day.toString()} }></ActivityList>
            </div>) }
        </div>
      )
      : (<BookmarkPlug
        buttonTitle={ 'К расписанию неанимации' }
        text={ [
          'Добавить мероприятие в избранное можно в разделе неАнимация.',
          'Нажмите на карточку мероприятия в списке — откроется подробная информация и кнопка «Добавить в избранное».',
          'Или свайпните название прямо в расписании.'
        ] }
        route={ '/activities' }
      />)
  );
};
