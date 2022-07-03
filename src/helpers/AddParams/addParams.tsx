import * as React from "react";
import { useParams } from "react-router-dom";

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
    const params = useParams();

    return <WrappedComponent {...params} {...(props as T)} />;
  };

  ComponentWithId.displayName = `withId(${displayName})`;

  return ComponentWithId;
};
