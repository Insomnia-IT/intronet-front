import { FunctionalComponent } from "preact";
import { SvgIcon, SvgIconProps } from "@icons";

export type BookmarkIconProps = {
  active?: boolean;
} & Omit<SvgIconProps, "id">;
export const BookmarkIcon: FunctionalComponent<BookmarkIconProps> = ({
  active,
  ...svgProps
}) => {
  const className = [
    active ? "strokeOnly" : undefined,
    "colorAddBase",
    svgProps.class ?? undefined,
    svgProps.className ?? undefined,
  ].filter((x) => x).join(" ");

  return (
    <SvgIcon
      id="#bookmark"
      class={className}
      {...svgProps}
    />
  );
};
