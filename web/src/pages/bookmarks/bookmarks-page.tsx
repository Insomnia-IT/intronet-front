import { Button, CloseButton } from "../../components";
import { Tag, Tags } from "../../components/tag";
import { useEffect } from "preact/hooks";
import { useRouter } from "../routing";
import { BookmarkActivities } from "./activity/BookmarkActivities";
import { BookmarkMovies } from "./movie/BookmarkMovies";
import { BookmarkLocations } from "./location/BookmarkLocations";
import { BookmarkNotes } from "./note/BookmarkNotes";
import { PageLayout } from "@components/PageLayout";
import { getButtonMetadata } from "./helpers/getButtonMetadata";

export const BookmarksPage = () => {
  const router = useRouter();
  const type = router.route[1] as Bookmark["type"];
  const goTo = (type: Bookmark["type"]) =>
    router.goTo(["bookmarks", type], {}, true);

  useEffect(() => {
    if (!type) goTo("movie");
  }, [type]);
  console.log(type);

  const { buttonRoute, buttonTitle } = getButtonMetadata(type);

  return (
    <PageLayout
      title='избранное'
      withCloseButton
      withTapBar
      buttons={(
        <Button
          type="vivid" class="w-full"
          goTo={buttonRoute}>
          {buttonTitle}
        </Button>
      )}
    >
      <Tags style={{ marginTop: 16, marginBottom: 20 }} tagsList={Sections}>
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
      {type == "movie" && <BookmarkMovies/>}
      {type == "activity" && <BookmarkActivities/>}
      {type == "locations" && <BookmarkLocations/>}
      {type == "note" && <BookmarkNotes/>}
      {/*<CloseButton/>*/}
    </PageLayout>
  );
};

const Sections: BookmarkSection[] = [
  "movie",
  "activity",
  "locations",
  "note",
];

const SectionNames: Record<BookmarkSection, string> = {
  movie: "Анимация",
  activity: "неАнимация",
  locations: "Площадки",
  note: "Объявления",
};
