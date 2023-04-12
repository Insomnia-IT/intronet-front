import { Timetable } from "./timetable/timetable";
import { Button, ButtonsBar, CloseButton } from "@components";
import { routes, useRouter } from "../routing";
import { Movie } from "./movie/movie";
import style from "../../app/app.style.module.css";
import { SvgIcon } from "@icons";
import { MovieSearch } from "./search/movie-search";

export function TimetablePage() {
  const router = useTimetableRouter();
  switch (router.movieId) {
    case "search":
      return (
        <div class={style.page}>
          <MovieSearch />
          <CloseButton back />
        </div>
      );
    case undefined:
      return (
        <div class={style.page}>
          <Timetable />
          <CloseButton />
          <ButtonsBar at="bottom">
            <Button type="vivid" goTo="/timetable/search">
              <SvgIcon id="#search" size={15} />
            </Button>
            <Button type="vivid" goTo="/bookmarks">
              <SvgIcon id="#bookmark" size="14px" />
              Избранное
            </Button>
          </ButtonsBar>
        </div>
      );
    default:
      return (
        <div class={style.page}>
          <Movie id={router.movieId} />
          <CloseButton back />
        </div>
      );
  }
}

const baseRoute = "timetable" as keyof typeof routes;
export function useTimetableRouter() {
  const router = useRouter();
  return {
    ...router,
    movieId: router.route[1] as string | undefined,
    gotToMovie(id: string) {
      router.goTo([baseRoute, id]);
    },
  };
}
