import { FunctionalComponent } from "preact";
import Style from "./card.module.css";
import { ComponentChildren } from "preact";
import { JSXInternal } from "preact/src/jsx";

export type ActivityCardProps = {
  children: ComponentChildren;
  border?: "Blue" | "Vivid" | "InactiveGrey" | "None";
  background?: "Purple" | "None" | "White" | "ColdWhite" | "Vivid";
} & JSXInternal.HTMLAttributes<HTMLDivElement>;
export const Card: FunctionalComponent<ActivityCardProps> = ({
  border,
  background,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={[
        Style.card,
        Style["border" + border],
        Style["bg" + background],
        className,
        props.class
      ]
        .filter((x) => x)
        .join(" ")}
    ></div>
  );
};
