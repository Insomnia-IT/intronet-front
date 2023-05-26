import { FunctionalComponent } from "preact";
import Styles from "./tag.module.css";
import { JSXInternal } from "preact/src/jsx";

export type TagProps = {
  selected: boolean;
} & Omit<JSXInternal.HTMLAttributes<HTMLDivElement>, "class" | "className">;

export const Tag: FunctionalComponent<TagProps> = ({ selected, ...props }) => {
  return <div class={selected ? Styles.selectedTag : Styles.tag} {...props} />;
};
