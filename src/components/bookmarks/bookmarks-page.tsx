import { useRouter } from "../../pages/routing";
import { bookmarksStore } from "@stores/bookmarks.store";
import { useCell } from "@helpers/cell-state";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { CloseButton } from "@components";
import { MovieList } from "../../pages/timetable/animation/animation-block";
import { Cell } from "@cmmn/cell/lib";

export const BookmarksPage = () => {
  const router = useRouter();
  const type = router.route[1] as Bookmark["type"];
  const goTo = (type: Bookmark["type"]) => router.goTo(["bookmarks", type]);
  useEffect(() => {
    if (!type) router.goTo(["bookmarks", "movie"]);
  }, [type]);
  console.log(type);
  return (
    <div class="page">
      <h1>избранное</h1>
      {type == "movie" && <BookmarkMovies />}
      <CloseButton />
    </div>
  );
};

const removedItems = new Cell(
  new Map<string, { movie: MovieInfo; timeoutId: number }>()
);
export const BookmarkMovies = () => {
  const items = useCell(() => bookmarksStore.Movies);
  const removed = useCell(() =>
    Array.from(removedItems.get().values()).map((x) => x.movie)
  );
  const switchBookmark = useCallback((movie: MovieInfo) => {
    const map = removedItems.get();
    const exist = map.get(movie.id);
    if (exist) {
      map.delete(movie.id);
      clearTimeout(exist.timeoutId);
    } else {
      map.set(movie.id, {
        movie,
        timeoutId: setTimeout(() => {
          const current = removedItems.get();
          current.delete(movie.id);
          removedItems.set(new Map(current));
        }, 5000) as any,
      });
    }
    removedItems.set(new Map(map));
    bookmarksStore.switchBookmark("movie", movie.id);
  }, []);
  return (
    <MovieList
      movies={items.concat(...removed).orderBy((x) => x.name)}
      showDeleted
      switchBookmark={switchBookmark}
    />
  );
};
