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
  wrapperClassName?: string;
  onClick?: (e?: JSX.TargetedMouseEvent<HTMLElement>) => void;
  children: (props: IBookmarkChildrenProps) => JSX.Element;
  borderRadius?: number;
  contentNoOpacity?: boolean;
  disabled?: boolean;
}

export const BookmarkGesture: FunctionalComponent<IBookmarkGestureProps> = ({
  gesture,
  hasBookmark,
  switchBookmark,
  children,
  wrapperClassName,
  placeholderClassName,
  className,
  borderRadius,
  contentNoOpacity = false,
  disabled,
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
  if (disabled)
    return <div class={className}>
      {children({iconOpacity: 0, classNames: []})}
    </div>;
  return (
    <div
      className={cx(wrapperClassName, {
        [styles.wrapperBordered]: Boolean(borderRadius),
        [styles.wrapperDemo]: needViewDemo,
      })}
      style={{
        "--border-radius": borderRadius || 0,
      }}
    >
      <div
        ref={ref}
        className={cx(styles.container, className, classNames)}
        style={{ transform }}
        {...props}
      >
        {
          contentNoOpacity ? (
          <div className={styles.contentWrapper}>
            {children({ iconOpacity, classNames })}
          </div>
          ) : children({ iconOpacity, classNames })
        }

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
    </div>
  )
}

export type IBookmarkChildrenProps = {
  iconOpacity: number;
  classNames: string[];
}
