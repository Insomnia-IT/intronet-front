import { SvgIcon } from "@icons";
import Styles from "./button.module.css";
import { Button } from "./button";
import { useRouter } from "../../pages/routing";
import { useCallback } from "preact/hooks";
import { FunctionalComponent } from "preact";
import classNames from "classnames";

export type CloseButtonProps = {
  onClick?(): void;
  white?: boolean;
  className?: string;
  position?: "absolute" | "static";
};

export const CloseButton: FunctionalComponent<CloseButtonProps> = ({onClick, ...props}) => {
  const router = useRouter();
  const onClickInternal = useCallback(() => {
    onClick?.();
    if (history.length > 0) {
      router.back();
    } else {
      router.goTo(["main"]);
    }
  }, [props]);

  return (
    <Button
      className={classNames(
        {
          [Styles.closeWhite]: props.white,
          [Styles.close]: !props.white,
          [Styles.closeStatic]: props.position === "static",
        },
        props.className
      )}
      onClick={onClickInternal}
    >
      <SvgIcon id="#x" size={14} />
    </Button>
  );
};
