import { Button, ButtonsBar, CloseButton, Sheet } from "@components";
import { SvgIcon } from "@icons";
import { useMemo } from "preact/hooks";
import { routes, useRouter } from "../routing";
import { MovieBlockEdit } from "./movie-block-edit";
import { Movie } from "./movie/movie";
import { MovieSearch } from "./search/movie-search";
import { TimetableAll } from "./timetable";

export function TimetablePage() {
    const router = useTimetableRouter();
    const sheets = useMemo(() => getTimetableSheets(router.movieId), [router.movieId]);
    return (
      <div class="page">
        <TimetableAll />
        <CloseButton goTo="/main" />
        <ButtonsBar at="bottom">
          <Button type="vivid" goTo="/timetable/search">
            <SvgIcon id="#search" size={15} />
          </Button>
          <Button type="vivid" goTo="/bookmarks/movie">
            <SvgIcon id="#bookmark" size="14px" />
            Избранное
          </Button>
        </ButtonsBar>
        <Sheet children={sheets} height="100%" onClose={() => router.goTo([baseRoute])}/>
      </div>
    );
}

function getTimetableSheets(movieId: string){
  switch (movieId) {
    case "edit":
      return <>
        <MovieBlockEdit />
      </>;
    case "search":
      return <>
        <MovieSearch />
        <CloseButton/>
      </>;
    case undefined:
      return null;
    default:
      return <>
        <Movie id={movieId} />
        <CloseButton/>
      </>;
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
