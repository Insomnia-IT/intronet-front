import { FC } from "preact/compat";
import {ActivityCard} from "@components/cards/activity";
import Styles from "./animation.module.css";

export type AnimationBlockProps = {
    block: MovieBlock;
}
export const AnimationBlock: FC<AnimationBlockProps> = props => {
    return <div>
        <div className={Styles.time}>{props.block.info.Start} - {props.block.info.End}</div>
        <ActivityCard>
            {props.block.info.Title}
        </ActivityCard>
    </div>
}