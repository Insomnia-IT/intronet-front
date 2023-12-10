import styles from "./chip.module.css";
export function Chip(props: ChipProps) {
  if (!props.icon && !props.value) {
    const classNames = [props.className ?? styles.chip];
    if (props.active)
      classNames.push(props.activeClassName ?? styles.chipActive);
    return (
      <div onClick={props.onClick} className={classNames.join(" ")}>
        {props.children}
      </div>
    );
  }
}

type ChipProps = {
  children: any;
  icon?: any;
  value?: number;
  activeClassName?: string;
  className?: string;
  active: boolean;
  onClick();
};
