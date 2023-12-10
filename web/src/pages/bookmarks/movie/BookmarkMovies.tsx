import { useCell } from "../../../helpers/cell-state";
import { bookmarksStore } from "../../../stores/bookmarks.store";
import { MovieList } from "../../timetable/animation/movie-list";
import { BookmarkPlug } from "../../../components/plugs/bookmark/BookmarkPlug";
import {orderBy} from "@cmmn/core";

export const BookmarkMovies = () => {
  const items = useCell(() => bookmarksStore.Movies);

  return (
    items.length > 0
      ? (<MovieList movies={ orderBy(items, (x) => x.name) }/>)
      : (<BookmarkPlug
        buttonTitle={ 'К расписанию анимации' }
        text={ [
          `Добавить мультфильм в избранное можно в разделе Анимация.`,
          `Нажмите на название мультфильма в списке — откроется подробная информация и кнопка «Добавить в избранное».`,
          `Или свайпните название прямо в расписании.`,
        ] }
        route={ '/timetable' }
      />)
  )
};
