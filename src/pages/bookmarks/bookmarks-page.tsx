import { CloseButton } from "@components";
import { Tag, Tags } from "@components/tag";
import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import { useEffect } from "preact/hooks";
import { useRouter } from "../routing";
import { MovieList } from "../timetable/animation/movie-list";

export const BookmarksPage = () => {
  const router = useRouter();
  const type = router.route[1] as Bookmark["type"];
  const goTo = (type: Bookmark["type"]) =>
    router.goTo(["bookmarks", type], {}, true);
  useEffect(() => {
    if (!type) goTo("movie");
  }, [type]);
  console.log(type);
  return (
    <div class="page">
      <h1>избранное</h1>
      <Tags style={{ margin: "16px 0 20px 0" }} tagsList={Sections}>
        {(x) => (
          <Tag
            key={x}
            value={x}
            onClick={() => goTo(x)}
            selected={x === router.route[1]}
          >
            {SectionNames[x]}
          </Tag>
        )}
      </Tags>
      {type == "movie" && <BookmarkMovies />}
      <CloseButton />
    </div>
  );
};

export const BookmarkMovies = () => {
  const items = useCell(() => bookmarksStore.Movies);
  return <MovieList movies={items.orderBy((x) => x.name)} />;
};

const Sections = [
  "movie",
  "activity",
  "locations",
  "notes",
] as Array<BookmarkSection>;
const SectionNames = {
  movie: "Анимация",
  activity: "неАнимация",
  locations: "Локации",
  notes: "Объявления",
} as Record<BookmarkSection, string>;
