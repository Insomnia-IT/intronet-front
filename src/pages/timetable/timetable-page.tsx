import {useMemo} from "preact/hooks";
import { TimetableAll } from "./timetable";
import { Button, ButtonsBar, CloseButton, Sheet } from "@components";
import { routes, useRouter } from "../routing";
import { Movie } from "./movie/movie";
import { SvgIcon } from "@icons";
import { MovieSearch } from "./search/movie-search";

export function TimetablePage() {
    const router = useTimetableRouter();
    const sheets = useMemo(() => getTimetableSheets(router.movieId), [router.movieId]);
    return (
      <div class="page">
        <TimetableAll />
        <CloseButton />
        <ButtonsBar at="bottom">
          <Button type="vivid" goTo="/timetable/search">
            <SvgIcon id="#search" size={15} />
          </Button>
          <Button type="vivid" goTo="/bookmarks/movie">
            <SvgIcon id="#bookmark" size="14px" />
            Избранное
          </Button>
        </ButtonsBar>
        <Sheet children={sheets} onClose={() => router.goTo([baseRoute])}/>
      </div>
    );
}

function getTimetableSheets(movieId: string){
  switch (movieId) {
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
