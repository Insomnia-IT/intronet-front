import { FunctionalComponent } from "preact";
import { locationsStore, moviesStore, MovieStore } from "@stores";
import { useMemo } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import style from "../../../app/app.style.module.css";
import Styles from "../animation/animation.module.css";
import { getDayText } from "@helpers/getDayText";
import { useTimetableRouter } from "../timetable-page";

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
      {state.blocks.map((block) => (
        <div key={block._id}>
          <div> {getDayText(block.day, "full")}</div>
          <div> {locationsStore.getName(block.locationId)}</div>
          <div
            class={style.link}
            onClick={() => router.goTo(["map", block.locationId])}
          >
            Локация на карте
          </div>
          <div>{block.info.Title}</div>
          <div>{block.info.SubTitle}</div>
          <div>
            {block.info.Start} - {block.info.End}
          </div>
        </div>
      ))}
    </div>
  );
};
