import { FC } from "preact/compat";
import { ActivityCard } from "@components/cards/activity";
import Styles from "./animation.module.css";
import { AgeStrict } from "@components/age-strict";

export type AnimationBlockProps = {
  block: MovieBlock;
};
export const AnimationBlock: FC<AnimationBlockProps> = (props) => {
  return (
    <div>
      <div className={Styles.time}>
        {props.block.info.Start} - {props.block.info.End}
      </div>
      <ActivityCard>
        <div class={Styles.header}>
          {props.block.info.Title}
          {props.block.info.MinAge && (
            <AgeStrict age={props.block.info.MinAge} />
          )}
        </div>
        {props.block.info.SubTitle}
      </ActivityCard>
    </div>
  );
};
