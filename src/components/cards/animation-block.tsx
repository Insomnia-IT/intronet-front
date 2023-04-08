import { FunctionalComponent } from "preact";
import { ActivityCard } from "@components/cards/activity";
import Styles from "./animation.module.css";
import { AgeStrict } from "@components/age-strict";
import {useMemo} from "preact/hooks";
import {MovieBlockStore, moviesStore} from "@stores";
import {useCell} from "@helpers/cell-state";

export type AnimationBlockProps = {
  id: string;
};
export const AnimationBlock: FunctionalComponent<AnimationBlockProps> = (props) => {
  const store = useMemo(() => new MovieBlockStore(props.id), [props.id])
  const block = useCell(() => store.block);
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
        </div>
      </ActivityCard>
    </div>
  );
};
