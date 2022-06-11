import React from "react";
import styles from "./chip.module.css";
export function Chip(props: ChipProps) {
  if (!props.icon && !props.value) {
    return (
      <div
        onClick={props.onClick}
        className={props.active ? styles.chipActive : styles.chip}
      >
        {props.children}
      </div>
    );
  }
}

type ChipProps = {
  children: any;
  icon?: any;
  value?: number;
  style?: {
    color: string;
    bg: string;
  };
  active: boolean;
  onClick();
};
