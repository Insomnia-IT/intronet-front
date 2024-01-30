import { useCell } from "../../../helpers/cell-state";
import { bookmarksStore } from "../../../stores/bookmarks.store";
import { BookmarkPlug } from "../../../components/plugs/bookmark/BookmarkPlug";
import { LocationList } from "../../map/location/location-list";
import { orderBy } from "@cmmn/core";

export const BookmarkLocations = () => {
  const items = useCell(() => bookmarksStore.Locations);

  return (
    items.length > 0
      ? (<LocationList locations={orderBy(items, (x) => x.name)}/>)
      : (<BookmarkPlug
        text={[
          `Добавить площадку в избранное можно на Карте.`,
          `Нажмите на площадку — откроется подробная информация и кнопка «Добавить в избранное».`,
        ]}
      />)
  );
};
