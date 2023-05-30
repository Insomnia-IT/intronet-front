import { FunctionalComponent } from "preact";
import Style from "./card.module.css";
import { ComponentChildren } from "preact";
import { JSXInternal } from "preact/src/jsx";
import classNames from "classnames";

export type ActivityCardProps = {
  children: ComponentChildren;
  borderType?: "LeftCloud";
  border?: "Blue" | "Vivid" | "InactiveGrey" | "None";
  background?: "Purple" | "None" | "White" | "ColdWhite" | "Soft" | "Vivid";
  className?: string;
} & JSXInternal.HTMLAttributes<HTMLDivElement>;

export const Card: FunctionalComponent<ActivityCardProps> = ({
  border,
  background,
  className,
  borderType,
  ...props
}) => {
  return (
    <div
      {...props}
      className={classNames([
        Style.card,
        Style["border" + border],
        Style["bg" + background],
        className,
        props.class as string,
        {
          [Style["border" + borderType]]: borderType,
        },
      ])}
    ></div>
  );
};
