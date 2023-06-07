import { Button } from "@components";
import { useOnlineState } from "@helpers/useOnlineState";
import classNames from "classnames";
import { FunctionalComponent } from "preact";
import styles from "./next-button.module.css";

export type INextButtonProps = {
  onClick: () => void;
  className?: string;
};

export const NextButton: FunctionalComponent<INextButtonProps> = ({
  children,
  onClick,
  className,
}) => {
  const { isOnline } = useOnlineState();
  const noteText =
    "Нет подключения к сети, вернитесь к точке WIFI, чтобы написать объявление";
  console.debug(isOnline);
  return (
    <div className={classNames(styles.container, className)}>
      {!isOnline && (
        <span
          className={classNames("textSmall", "colorChineeseCaffe", styles.note)}
        >
          {noteText}
        </span>
      )}
      <Button type={"vivid"} onClick={onClick} disabled={!isOnline}>
        {children}
      </Button>
    </div>
  );
};
