import { FunctionalComponent } from "preact";
import { Button, ButtonProps } from "./button";
import { useOnlineState } from "../../helpers/useOnlineState";
import cx from "classnames";
import styles from "./button.module.css";

export type IOnlineButtonProps = ButtonProps & {
  disconectNoteText?: string;
  buttonClassName?: string;
};

export const OnlineButton: FunctionalComponent<IOnlineButtonProps> = ({
  disconectNoteText,
  className,
  buttonClassName,
  disabled,
  ...props
}) => {
  const { isOnline } = useOnlineState();
  const noteText =
    disconectNoteText ||
    "Нет подключения к сети, вернитесь к точке WIFI, чтобы написать объявление";

  return (
    <div className={cx(styles.buttonOnlineContainer, className as string)}>
      {!isOnline && (
        <span
          className={cx(
            "textSmall",
            "colorChineeseCaffe",
            styles.buttonOnlineNote
          )}
        >
          {noteText}
        </span>
      )}
      <Button
        {...props}
        className={cx(buttonClassName, styles.buttonOnline)}
        disabled={!isOnline || disabled}
      />
    </div>
  );
};
