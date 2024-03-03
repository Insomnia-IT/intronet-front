import { SvgIcon } from "../../icons";
import Styles from "./button.module.css";
import { Button } from "./button";
import { RoutePath, RoutePathString, useRouter } from "../../pages/routing";
import { useCallback } from "preact/hooks";
import { FunctionalComponent } from "preact";
import classNames from "classnames";

export type CloseButtonProps = {
  onClick?(): void;
  goTo?: RoutePath | RoutePathString;
  white?: boolean;
  className?: string;
  position?: "absolute" | "static";
};

export const CloseButton: FunctionalComponent<CloseButtonProps> = (props) => {
  const router = useRouter();

  const onClick = useCallback(() => {
    if (props.onClick) {
      props.onClick();
      return;
    }

    if (props.goTo) {
      router.goTo(props.goTo);
      return;
    }

    if (history.length > 0) {
      router.back();
    } else {
      router.goTo(["main"]);
    }
  }, [props?.onClick, props?.goTo]);

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
      onClick={onClick}
    >
      <SvgIcon id="#x" size={14} />
    </Button>
  );
};
