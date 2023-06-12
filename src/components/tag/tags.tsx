import { VNode } from "preact";
import Styles from "./tag.module.css";
import { JSXInternal } from "preact/src/jsx";
import classNames from "classnames";

export type TagsProps<ITags extends ReadonlyArray<any> = ReadonlyArray<any>> = {
  tagsList: ITags;
  children: (tag: ITags[number]) => VNode | null;
} & Omit<JSXInternal.HTMLAttributes<HTMLDivElement>, "className">;

export const Tags = <ITags extends Array<any> = any[]>(
  props: TagsProps<ITags>
) => {
  return (
    <div {...props} class={classNames(Styles.tags, props.class as string)}>
      {props.tagsList.map(props.children)}
    </div>
  );
};
