import * as React from "react";
import {useRouter} from "../../pages/routing";

export type WithIdProps = {
  id: string;
};

export const withId = <T extends WithIdProps>(
  WrappedComponent: React.ComponentType<T>
) => {
  // Try to create a nice displayName for React Dev Tools.
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  const ComponentWithId = (props: Omit<T, keyof WithIdProps>) => {
    const {route} = useRouter();

    return <WrappedComponent id={route[1]} {...(props as T)} />;
  };

  ComponentWithId.displayName = `withId(${displayName})`;

  return ComponentWithId;
};
