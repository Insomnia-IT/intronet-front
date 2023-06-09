import { EyeLoading } from "@icons";
import Styles from "./button.module.css";
import { FunctionalComponent, JSX } from "preact";
import { RoutePath, RoutePathString, useRouter } from "../../pages/routing";
import { useCallback, useMemo } from "preact/hooks";

export type ButtonProps = {
  isLoading?: boolean;
  solid?: boolean;
  selected?: boolean;
  type?: "frame" | "blue" | "disco" | "vivid" | "text" | "borderVivid";
  goTo?: RoutePath | RoutePathString;
} & JSX.HTMLAttributes<HTMLButtonElement>;

export const Button: FunctionalComponent<ButtonProps> = ({
  className,
  type,
  goTo,
  isLoading,
  children,
  ...props
}) => {
  const router = useRouter();
  const onClick = useMemo(
    () => (goTo ? () => !props.disabled && router.goTo(goTo) : undefined),
    [goTo, props.disabled]
  );
  const classNames = [Styles.button, className, props.class].filter((x) => x);
  if (props.selected) classNames.push(Styles.selected);
  if (type) classNames.push(Styles[type]);

  return (
    <button
      onClick={onClick}
      {...props}
      className={classNames.join(" ")}
      children={
        isLoading ? (
          <div style={{ margin: "-8px 0", height: "1.5em" }}>
            <EyeLoading size="1.5em" />
          </div>
        ) : (
          <span>{children}</span>
        )
      }
    />
  );
};
