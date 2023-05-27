import Style from "./badge.module.css";
import { FunctionalComponent } from "preact";
import { JSXInternal } from "preact/src/jsx";

type BadgeProps = {
  badgeType?: "Age" | "Adv" | "Change";
} & JSXInternal.HTMLAttributes<HTMLDivElement>;

export const Badge: FunctionalComponent<BadgeProps> = ({
                                                         badgeType,
                                                         className,
                                                         ...props
                                                       }: BadgeProps) => {
  return (
    <div className={ [
      Style.badge,
      Style["badge" + badgeType],
      className,
      props.class ]
      .filter((x) => x)
      .join(" ") } { ...props }/>
  );
}
