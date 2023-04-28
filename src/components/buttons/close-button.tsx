import { SvgIcon } from "@icons";
import Styles from "./button.module.css";
import { Button } from "./button";
import { useRouter } from "../../pages/routing";
import { useCallback } from "preact/hooks";
import { FunctionalComponent } from "preact";

export type CloseButtonProps = {
  onClick?(): void;
};
export const CloseButton: FunctionalComponent<CloseButtonProps> = (props) => {
  const router = useRouter();
  const onClick = useCallback(() => {
    if (history.length > 0) {
      router.back();
    } else {
      router.goTo(["main"]);
    }
  }, [props]);
  return (
    <Button className={Styles.close} onClick={props.onClick ?? onClick}>
      <SvgIcon id="#x" size={14} />
    </Button>
  );
};
