import { FunctionalComponent } from "preact";
import Style from "./activity.module.css";
import { ComponentChildren } from "preact";

export type ActivityCardProps = {
  children: ComponentChildren;
  border?: "Blue" | "Vivid";
  background?: "Purple" | "None" | "White";
};
export const Card: FunctionalComponent<ActivityCardProps> = (props) => {
  return (
    <div
      className={[
        Style.activity,
        Style["border" + props.border],
        Style["bg" + props.background],
      ]
        .filter((x) => x)
        .join(" ")}
    >
      {props.children}
    </div>
  );
};
