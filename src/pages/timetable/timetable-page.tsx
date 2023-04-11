import { Timetable } from "./timetable/timetable";
import { CloseButton } from "@components";
import { routes, useRouter } from "../routing";
import { Movie } from "./movie/movie";
import style from "../../app/app.style.module.css";

export function TimetablePage() {
  const router = useTimetableRouter();
  if (router.movieId != undefined) {
    return (
      <div class={style.page}>
        <Movie id={router.movieId} />
        <CloseButton back />
      </div>
    );
  }
  return (
    <div class={style.page}>
      <Timetable />
      <CloseButton />
    </div>
  );
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
