import { FunctionalComponent, JSX } from "preact";
import { RoutePath, RoutePathString, useRouter } from "../../pages/routing";
import { useMemo } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import SignalLike = JSXInternal.SignalLike;

export type LinkProps = {
  goTo: RoutePath | RoutePathString;
} & JSX.HTMLAttributes<HTMLAnchorElement>;
export const Link: FunctionalComponent<LinkProps> = ({
  onClick,
  className,
  ...props
}) => {
  const router = useRouter();
  const onClickInternal = useMemo<JSX.MouseEventHandler<HTMLAnchorElement>>(
    () =>
      props.goTo
        ? (e) => {
            router.goTo(props.goTo);
            onClick?.(e);
          }
        : undefined,
    [props.goTo, onClick]
  );
  const classNames = ["link"] as Array<string | SignalLike<string>>;
  if (className) classNames.push(className);
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
