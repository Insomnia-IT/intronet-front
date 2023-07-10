import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import { BookmarkPlug } from "@components/plugs/bookmark/BookmarkPlug";
import { LocationList } from "../../map/location/location-list";

export const BookmarkLocations = () => {
  const items = useCell(() => bookmarksStore.Locations);

  return (
    items.length > 0
      ? (<LocationList locations={ items.orderBy((x) => x.name) }/>)
      : (<BookmarkPlug
        buttonTitle={ 'на карту' }
        text={ [
          `Добавить площадку в избранное можно на Карте.`,
          `Нажмите на площадку — откроется подробная информация и кнопка «Добавить в избранное».`,
        ] }
        route={ '/map' }
      />)
  );
};
