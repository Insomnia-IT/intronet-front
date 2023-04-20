import Styles from "./button.module.css";
import { FunctionalComponent } from "preact";
import { RoutePath, RoutePathString, useRouter } from "../../pages/routing";
import { useCallback, useMemo } from "preact/hooks";

export type ButtonProps = {
  isLoading?: boolean;
  solid?: boolean;
  selected?: boolean;
  type?: "frame" | "blue" | "disco" | "vivid" | "text";
  goTo?: RoutePath | RoutePathString;
} & React.JSX.HTMLAttributes<HTMLButtonElement>;
export const Button: FunctionalComponent<ButtonProps> = ({
  className,
  type,
  goTo,
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
    <button onClick={onClick} {...props} className={classNames.join(" ")} />
  );
};
