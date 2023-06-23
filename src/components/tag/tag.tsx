import { FunctionalComponent } from "preact";
import {useEffect, useRef} from "preact/hooks";
import Styles from "./tag.module.css";
import { JSXInternal } from "preact/src/jsx";
import classNames from "classnames";

export type TagProps = {
  selected: boolean;
} & JSXInternal.HTMLAttributes<HTMLDivElement>;

export const Tag: FunctionalComponent<TagProps> = ({
  selected,
  className,
  onClick,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    if (ref.current && selected) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.left < 0 || rect.right > window.innerWidth) {
        const parent = ref.current.parentElement as HTMLDivElement;
        parent.scrollTo({
          left: rect.left,
          behavior: "smooth"
        });
      }
    }
  }, [selected, ref.current]);
  return (
    <div
      {...props}
      ref={ref}
      onClick={onClick}
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
