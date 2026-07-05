import { EyeLoading } from "../../icons";
import Styles from "./button.module.css";
import { FunctionalComponent, JSX } from "preact";
import { RoutePath, RoutePathString, useRouter } from "../../pages/routing";
import { useMemo } from "preact/hooks";

export type ButtonProps = {
  isLoading?: boolean;
  /** Нативный type у `<button>` (не путать с визуальным `type`). */
  buttonType?: "button" | "submit" | "reset";
  type?:
    | "frame"
    | "blue"
    | "disco"
    | "vivid"
    | "text"
    | "orange"
    | "frameOrange"
    | "textSimple"
    | "danger"
    | "ghost"
    | "ghostDark"
    | "textDanger";
  goTo?: RoutePath | RoutePathString;
  href?: string;
} & JSX.HTMLAttributes<HTMLButtonElement>;

export const Button: FunctionalComponent<ButtonProps> = ({
  className,
  type,
  buttonType,
  goTo,
  isLoading,
  children,
  ...props
}) => {
  const router = useRouter();
  const onClick = useMemo(
    () =>
      goTo
        ? () => !props.disabled && router.goTo(goTo)
        : props.href
        ? () => {
            window.open(props.href, "_blank");
          }
        : undefined,
    [goTo, props.disabled, props.href]
  );
  const classNames = [Styles.button, className, props.class].filter((x) => x);
  if (props.selected) classNames.push(Styles.selected);
  if (type) classNames.push(Styles[type]);

  return (
    <button
      type={buttonType}
      onClick={onClick}
      {...props}
      className={classNames.join(" ")}
      children={
        isLoading ? (
          <div style={{ margin: "-8px 0", height: "1.5em" }}>
            <EyeLoading size="1.5em" />
          </div>
        ) : (
          children
        )
      }
    />
  );
};
