import { RequireAuth } from "../../../components/RequireAuth";
import { FunctionalComponent } from "preact";
import { Card } from "../../../components/cards";
import Styles from "./animation.module.css";
import { AgeStrict } from "../../../components/age-strict";
import { useMemo } from "preact/hooks";
import { MovieBlockStore } from "../../../stores";
import { useCell } from "../../../helpers/cell-state";
import { Button } from "../../../components";
import { useHistoryState } from "../../routing";
import { MovieList } from "./movie-list";
import styles from "./animation.module.css";

export type AnimationBlockProps = {
  id: string;
  day: number;
  locationId: string;
};
export const AnimationBlock: FunctionalComponent<AnimationBlockProps> = (
  props
) => {
  const store = useMemo(
    () => new MovieBlockStore(props.id, props.day, props.locationId),
    [props.id, props.day, props.locationId]
  );
  const { block, duplicate, view } = useCell(store.state);
  const [isOpen, setIsOpen] = useHistoryState<boolean>(
    `${props.id}.${props.day}.${props.locationId}`,
    false
  );
  return (
    <div>
      <div class={styles.editButton}>
        <RequireAuth>
          <Button
            class="w-full"
            goTo={["timetable", "edit", props.id]}
            type="frame"
          >
            изменить время
          </Button>
        </RequireAuth>
      </div>
      <div className={[Styles.time, "sh1"].join(" ")}>
        {view.start} - {view.end}
      </div>
      <Card
        background="Soft"
        style={{
          marginBottom: 30,
          paddingBottom: 8,
          paddingTop: 24,
          alignItems: "stretch",
        }}
      >
        <div
          flex
          column
          gap
          onClick={isOpen ? undefined : () => setIsOpen(true)}
        >
          <div class={[Styles.header, "sh1"].join(" ")}>
            {block.info.Title}{" "}
            {block.info.Part ? ` — Часть ${block.info.Part}` : ""}
            {block.info.MinAge > 0 ? (
              <AgeStrict age={block.info.MinAge as 12 | 18} />
            ) : null}
          </div>
          <div class="textSmall colorGrey">{block.info.SubTitle ?? ""}</div>
          <div class={[Styles.duplicate, "colorMineral"].join(" ")}>
            {duplicate}
          </div>
          {isOpen && <MovieList movies={block.movies} />}
          <Button class={styles.openButton} type="text" onClick={() => setIsOpen((x) => !x)}>
            {isOpen ? "СВЕРНУТЬ РАСПИСАНИЕ" : "ПОКАЗАТЬ РАСПИСАНИЕ"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
