import { FunctionalComponent } from "preact";
import { SvgIcon, SvgIconProps } from "@icons";

export type BookmarkIconProps = {
  active?: boolean;
} & Omit<SvgIconProps, "id">;
export const BookmarkIcon: FunctionalComponent<BookmarkIconProps> = ({
  active,
  ...svgProps
}) => {

  return (
    <SvgIcon
      id="#bookmark"
      class={[
        active ? "strokeOnly" : undefined,
        svgProps.class ?? undefined,
        svgProps.className ?? undefined,
      ]
        .filter((x) => x)
        .join(" ")}
      {...svgProps}
    />
  );
};
