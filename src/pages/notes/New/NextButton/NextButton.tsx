import { Button } from "@components";
import { useOnlineState } from "@helpers/useOnlineState";
import classNames from "classnames";
import { FunctionalComponent } from "preact";
import styles from "./next-button.module.css";
import { JSX } from "preact";

export type INextButtonProps = {
  onClick: (e?: JSX.TargetedEvent<HTMLButtonElement>) => void;
  className?: string;
} & JSX.HTMLAttributes<HTMLButtonElement>;

export const NextButton: FunctionalComponent<INextButtonProps> = ({
  children,
  onClick,
  className,
  selected,
  disabled,
  ...props
}) => {
  const { isOnline } = useOnlineState();
  const noteText =
    "Нет подключения к сети, вернитесь к точке WIFI, чтобы написать объявление";

  return (
    <div className={classNames(styles.container, className)}>
      {!isOnline && (
        <span
          className={classNames("textSmall", "colorChineeseCaffe", styles.note)}
        >
          {noteText}
        </span>
      )}
      <Button
        {...props}
        className={styles.button}
        type={"vivid"}
        onClick={onClick}
        disabled={!isOnline || disabled}
      >
        {children}
      </Button>
    </div>
  );
};
