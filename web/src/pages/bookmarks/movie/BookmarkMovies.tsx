import { useCell } from "../../../helpers/cell-state";
import { bookmarksStore } from "../../../stores/bookmarks.store";
import { MovieList } from "../../timetable/animation/movie-list";
import { BookmarkPlug } from "../../../components/plugs/bookmark/BookmarkPlug";
import { orderBy } from "@cmmn/core";
import { useMemo } from "preact/hooks";
import { useBookmarksRouter } from "../hooks/useBookmarksRouter";
import { moviesStore } from "../../../stores";
import { getDayText } from "../../../helpers/getDayText";
import { Tag, Tags } from "@components";

const movieDays = [0, 1, 2, 3];

export const BookmarkMovies = () => {
  const items = useCell(() => bookmarksStore.Movies);
  const blocks = useCell(() => moviesStore.MovieBlocks);
  const { day, setDay } = useBookmarksRouter();

  const movies = useMemo(() => {
    const filtered = items.filter((movie) =>
      blocks.some(
        (block) =>
          block.movies.some((m) => m.id === movie.id) &&
          block.views.some((v) => v.day === day)
      )
    );
    return orderBy(filtered, (x) => x.name);
  }, [items, blocks, day]);

  if (items.length === 0) {
    return (
      <BookmarkPlug
        text={[
          `Добавить мультфильм в избранное можно в разделе Анимация.`,
          `Нажмите на название мультфильма в списке — откроется подробная информация и кнопка «Добавить в избранное».`,
          `Или свайпните название прямо в расписании.`,
        ]}
      />
    );
  }

  return (
    <>
      <div flex column style={{ margin: "0 0 16px 0" }}>
        <Tags tagsList={movieDays}>
          {(d) => (
            <Tag
              selected={d == day}
              key={d}
              style={{ textAlign: "center", padding: "15.5px 16px" }}
              onClick={() => setDay(d)}
            >
              {getDayText(d, "short").toUpperCase()}
            </Tag>
          )}
        </Tags>
      </div>
      <MovieList movies={movies} />
    </>
  );
};
