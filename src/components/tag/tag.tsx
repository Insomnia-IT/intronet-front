import { FunctionalComponent } from "preact";
import {useCallback} from "preact/hooks";
import Styles from "./tag.module.css";
import { JSXInternal } from "preact/src/jsx";
import classNames from "classnames";
import TargetedMouseEvent = JSXInternal.TargetedMouseEvent;

export type TagProps = {
  selected: boolean;
} & JSXInternal.HTMLAttributes<HTMLDivElement>;

export const Tag: FunctionalComponent<TagProps> = ({
  selected,
  className,
  onClick,
  ...props
}) => {
  const onClickInternal = useCallback((e: TargetedMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.left < 0 || rect.right > window.innerWidth){
      const parent = e.currentTarget.parentElement as HTMLDivElement;
      parent.scrollTo({
        left: rect.left,
        behavior: "smooth"
      });
    }
    onClick?.(e);
  }, [onClick]);
  return (
    <div
      {...props}
      onClick={onClickInternal}
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
