import { FunctionalComponent, JSX } from "preact";
import { RoutePath, RoutePathString, useRouter } from "../../pages/routing";
import { useMemo } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import SignalLike = JSXInternal.SignalLike;

export type LinkProps = {
  goTo: RoutePath | RoutePathString;
  query?: Record<string, any>;
  replace?: boolean;
} & JSX.HTMLAttributes<HTMLAnchorElement>;
export const Link: FunctionalComponent<LinkProps> = ({
  onClick,
  className,
  disabled,
  query,
  replace,
  ...props
}) => {
  const router = useRouter();
  const onClickInternal = useMemo<JSX.MouseEventHandler<HTMLAnchorElement>>(
    () =>
      props.goTo
        ? (e) => {
            router.goTo(props.goTo, query, !!replace);
            onClick?.(e);
          }
        : undefined,
    [props.goTo, onClick, query, replace]
  );
  const classNames = ["link"] as Array<string | SignalLike<string>>;
  if (className) classNames.push(className);
  if (disabled) classNames.push('disabled')
  return (
    <a
      className={classNames.join(" ")}
      onClick={onClickInternal ?? onClick}
      {...props}
    >
      {props.children}
    </a>
  );
};
