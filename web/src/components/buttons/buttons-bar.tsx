import {JSX, FunctionalComponent,} from "preact";
import cn from 'classnames';
import styles from "./button.module.css";

export type ButtonsBarProps = {
    at?: 'bottom' | 'right' | 'left' | 'bottomWithTapbar';
    fill?: boolean;
} & JSX.HTMLAttributes<HTMLDivElement>

export const ButtonsBar: FunctionalComponent<ButtonsBarProps> = (props) => {
    const {children, at, className, fill = false, ...divProps} = props;
    const classNames = [styles.buttonsBar];
    switch (at){
        case "left": classNames.push(styles.left); break;
        case "right": classNames.push(styles.right); break;
        case "bottomWithTapbar": classNames.push(cn(styles.bottom, styles.withTapbar)); break;
        default: classNames.push(styles.bottom); break;
    }
    if (className) classNames.push(className as string);
    if (fill) classNames.push(styles.fill)
    return <div class={classNames.join(' ')} {...divProps}>
        {props.children}
    </div>
}
