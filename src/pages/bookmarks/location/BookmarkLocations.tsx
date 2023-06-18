import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import { BookmarkPlug } from "@components/plugs/bookmark/BookmarkPlug";

export const BookmarkLocations = () => {
  const items = useCell(() => bookmarksStore.Locations);

  return (
    items.length > 0
      ? (
        <div flex column style={ 'gap: 24px' }>
          { items.map(day => <span>{day.name}</span>) }
        </div>
      )
      : (<BookmarkPlug
        buttonTitle={ 'на карту' }
        text={ [
          `Добавить локацию в избранное можно на Карте.`,
          `Нажмите на локацию — откроется подробная информация и кнопка «Добавить в избранное».`,
        ] }
        route={ '/map' }
      />)
  );
};
