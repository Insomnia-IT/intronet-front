import { Gesture, useGestures } from "@helpers/Gestures";
import { FunctionalComponent } from "preact";
import { useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import cx from 'classnames'
import styles from './bookmarks-gesture.module.css';
import { SvgIcon } from "@icons";

export type IBookmarkGestureProps = {
  gesture: Gesture;
  hasBookmark: boolean;
  switchBookmark: () => void;
  className?: string;
  placeholderClassName?: string;
  onClick?: (e?: JSX.TargetedMouseEvent<HTMLElement>) => void;
  children: (props: IBookmarkChildrenProps) => JSX.Element;
}

export const BookmarkGesture: FunctionalComponent<IBookmarkGestureProps> = ({
  gesture,
  hasBookmark,
  switchBookmark,
  children,
  placeholderClassName,
  className,
  ...props
}) => {
  const ref = useRef();
  const {
    transform,
    iconOpacity,
    classNames,
    state,
    gestureLength,
    needViewDemo
  } = useGestures(
    ref,
    hasBookmark,
    switchBookmark,
    gesture,
  );

  return (
    <div
      ref={ref}
      className={cx(styles.container, className, classNames, needViewDemo && styles.bookmarkDemo)}
      style={{ transform }}
      {...props}
    >

      {children({ iconOpacity, classNames })}

      <div
        className={cx(styles["bookmarkAdd" + state], placeholderClassName)}
        style={{
          "--width": gestureLength + "px",
        }}
      >
        <SvgIcon
          id="#bookmark"
          class={
            state == "Deleting" || (!hasBookmark && state !== "Adding")
              ? "strokeOnly"
              : undefined
          }
        />
      </div>
    </div>
  )
}

export type IBookmarkChildrenProps = {
  iconOpacity: number;
  classNames: string[];
}
