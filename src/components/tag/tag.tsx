import { FunctionalComponent } from "preact";
import Styles from "./tag.module.css";
import { JSXInternal } from "preact/src/jsx";
import classNames from "classnames";

export type TagProps = {
  selected: boolean;
} & JSXInternal.HTMLAttributes<HTMLDivElement>;

export const Tag: FunctionalComponent<TagProps> = ({
  selected,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={classNames(
        {
          [Styles.selectedTag]: selected,
          [Styles.tag]: !selected,
        },
        className as string
      )}
    />
  );
};
