import { FunctionalComponent } from "preact";
import { locationsStore, moviesStore, MovieStore } from "@stores";
import { useMemo } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import style from "../../../app/app.style.module.css";
import Styles from "../animation/animation.module.css";
import { getDayText } from "@helpers/getDayText";
import { useTimetableRouter } from "../timetable-page";
import { ActivityCard } from "@components/cards";
import { Button, ButtonsBar } from "@components";
import { SvgIcon } from "@icons";
import { bookmarksStore } from "@stores/bookmarks.store";
import { Link } from "@components/link/link";

export type MovieProps = {
  id: string;
};
export const Movie: FunctionalComponent<MovieProps> = (props) => {
  const router = useTimetableRouter();
  const store = useMemo(() => new MovieStore(props.id), [props.id]);
  const state = useCell(store.state);
  const movie = state.movie ?? ({} as MovieInfo);
  const screenLocations = useCell(() => locationsStore.ScreenLocations);
  const [minutes, seconds] = movie.duration?.split(/[:'"]/) ?? [];
  if (!screenLocations.length) return <></>;
  return (
    <div flex column gap={2}>
      <header className={style.sh1}>«{movie?.name}»</header>
      <div className={style.sh1}>{movie?.description}</div>
      <div class={Styles.movieInfo}>
        {movie.author}, {movie.country}, {movie.year}
      </div>
      <div class={Styles.movieInfo}>
        {minutes} мин {seconds} сек
      </div>
      <ActivityCard border="Vivid" background="White">
        <div class={[style.sh1, style.colorPink].join(" ")}>
          Международный конкурс анимации
        </div>
        <div class={[style.sh3, style.colorPink].join(" ")}>
          Приз зрительских симпатий
        </div>
        <Link goTo="/voting">Голосование</Link>
        <div>Голосовать можно только онлайн</div>
        <div>Для голосования потребуется номер билета</div>
      </ActivityCard>
      {state.block.views.map((view) => (
        <div key={view.day + view.locationId}>
          <div> {getDayText(view.day, "full")}</div>
          <ActivityCard border="Blue" background="None">
            <div> {locationsStore.getName(view.locationId)}</div>
            <Link goTo={["map", view.locationId]}>Локация на карте</Link>
            <div>{state.block.info.Title}</div>
            <div>{state.block.info.SubTitle}</div>
            <div>
              {view.start} - {view.end}
            </div>
          </ActivityCard>
        </div>
      ))}
      <ButtonsBar at="bottom">
        <Button
          type="vivid"
          onClick={() => bookmarksStore.switchBookmark("movie", movie.id)}
        >
          <SvgIcon id="#bookmark" size={14} />
          {state.hasBookmark
            ? "Удалить из избранного"
            : "сохранить в избранное"}
        </Button>
      </ButtonsBar>
    </div>
  );
};
