import { Fragment } from "preact";
import { PageLayout } from "@components/PageLayout";
import { Button, CloseButton, Sheet } from "../../components";
import { SvgIcon } from "../../icons";
import { useMemo } from "preact/hooks";
import { routes, useRouter } from "../routing";
import { MovieBlockEdit } from "./movie-block-edit";
import { Movie } from "./movie/movie";
import { MovieSearch } from "./search/movie-search";
import { TimetableAll } from "./timetable";
import { ActivitySearch } from "../activities/search/activity-search";

export function TimetablePage() {
  const router = useTimetableRouter();
  const sheets = useMemo(
    () => getTimetableSheets(router.movieId),
    [router.movieId]
  );
  return (
    <PageLayout
      title={"анимация"}
      favoritesRoute="/bookmarks/movie"
      withTapBar
      search={MovieSearch}
      hideSearchDeps={[router.movieId]}
      searchLabel="Название мультфильма"
    >
      <TimetableAll />
      <Sheet
        children={sheets}
        height="100%"
        onClose={() => router.goTo([baseRoute])}
      />
    </PageLayout>
  );
}

function getTimetableSheets(movieId: string) {
  switch (movieId) {
    case "edit":
      return (
        <>
          <MovieBlockEdit />
        </>
      );
    case "search":
      return (
        <MovieSearch />
      );
    case undefined:
      return null;
    default:
      return (
        <Movie id={movieId} />
      );
  }
}

const baseRoute = "timetable" as keyof typeof routes;
export function useTimetableRouter() {
  const router = useRouter();
  return {
    ...router,
    movieId: router.route[1] as string | undefined,
    goToMovie(id: string | undefined) {
      router.goTo(id ? [baseRoute, id] : [baseRoute]);
    },
  };
}
