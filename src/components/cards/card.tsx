import { FunctionalComponent } from "preact";
import Style from "./card.module.css";
import { ComponentChildren } from "preact";
import { JSXInternal } from "preact/src/jsx";

export type ActivityCardProps = {
  children: ComponentChildren;
  border?: "Blue" | "Vivid";
  background?: "Purple" | "None" | "White";
} & JSXInternal.HTMLAttributes<HTMLDivElement>;
export const Card: FunctionalComponent<ActivityCardProps> = ({
  border,
  background,
  className,
  ...props
}) => {
  return (
    <div
      className={[
        Style.card,
        Style["border" + border],
        Style["bg" + background],
        className,
      ]
        .filter((x) => x)
        .join(" ")}
      {...props}
    ></div>
  );
};
