import { FunctionalComponent } from "preact";
import { ActivityCard } from "@components/cards/activity";
import Styles from "./animation.module.css";
import { AgeStrict } from "@components/age-strict";
import {useMemo, useState} from "preact/hooks";
import {
MovieBlockStore, moviesStore} from "@stores";
import {useCell} from "@helpers/cell-state";
import {Button} from "@components";

export type AnimationBlockProps = {
  id: string;
};
export const AnimationBlock: FunctionalComponent<AnimationBlockProps> = (props) => {
  const store = useMemo(() => new
MovieBlockStore(props.id), [props.id])
  const { block, duplicate } = useCell(store.state);
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <div className={Styles.time}>
        {block.info.Start} - {block.info.End}
      </div>
      <ActivityCard>
        <div flex column gap>
          <div class={Styles.header}>
            {block.info.Title}
            {block.info.MinAge && (
              <AgeStrict age={block.info.MinAge} />
            )}
          </div>
          <div class={Styles.subHeader}>{block.info.SubTitle}</div>
          <div class={Styles.duplicate}>
          {duplicate}
          </div>
          {isOpen && <div flex column gap="6">
            {block.movies.map((m,i) => <Movie movie={m} key={i}/>)}
          </div>}
          <Button type="text" onClick={() => setIsOpen(x => !x)}>
            {isOpen ? 'СВЕРНУТЬ РАСПИСАНИЕ' : 'ПОКАЗАТЬ РАСПИСАНИЕ'}
          </Button>
        </div>
      </ActivityCard>
    </div>
  );
};

const Movie: FunctionalComponent<{movie: MovieInfo}> = ({movie}) => {
  const [minutes, seconds] = movie.duration?.split(/[:'"]/) ?? [];
  return <div flex column gap>
    <div class={Styles.movieTitle}>«{movie.name}»</div>
    <div class={Styles.movieInfo}>{movie.author}, {movie.country}, {movie.year}</div>
    <div class={Styles.movieInfo}>{minutes} мин {seconds} сек</div>
  </div>
}
