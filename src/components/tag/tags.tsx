import { FunctionalComponent } from "preact";
import Styles from "./tag.module.css";
import { JSXInternal } from "preact/src/jsx";

export type TagsProps<TKey extends string | number = string | number> =
  {} & Omit<JSXInternal.HTMLAttributes<HTMLDivElement>, "class" | "className">;
export const Tags: FunctionalComponent<TagsProps> = (props) => {
  return <div class={Styles.tags}>{props.children}</div>;
};
