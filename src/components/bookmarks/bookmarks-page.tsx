import { useRouter } from "../../pages/routing";
import { bookmarksStore } from "@stores/bookmarks.store";
import { useCell } from "@helpers/cell-state";
import { useEffect } from "preact/hooks";
import { CloseButton } from "@components";
import { MovieSmall } from "../../pages/timetable/animation/movie-small";

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
      <CloseButton back />
    </div>
  );
};

export const BookmarkMovies = () => {
  const items = useCell(() => bookmarksStore.Movies);
  return (
    <>
      {items.map((x) => (
        <MovieSmall movie={x} />
      ))}
    </>
  );
};
