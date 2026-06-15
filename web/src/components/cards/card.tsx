import { FunctionalComponent } from "preact";
import Style from "./card.module.css";
import { ComponentChildren } from "preact";
import { JSX } from "preact";
import classNames from "classnames";

export type ActivityCardProps = {
  children: ComponentChildren;
  borderType?: "LeftCloud";
  border?: "Blue" | "Vivid" | "InactiveGrey" | "None" | "Yellow" | "Grey";
  background?:
    | "Purple"
    | "None"
    | "White"
    | "ColdWhite"
    | "Soft"
    | "Soft2"
    | "Vivid"
    | "Night"
    | "Yellow";
  className?: string;
} & JSX.HTMLAttributes<HTMLDivElement>;

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
