import {JSX, FunctionalComponent,} from "preact";
import styles from "./button.module.css";

export type ButtonsBarProps = {
    at?: 'bottom' | 'right' | 'left';
} & JSX.HTMLAttributes<HTMLDivElement>

export const ButtonsBar: FunctionalComponent<ButtonsBarProps> = (props) => {
    const {children, at, className, ...divProps} = props;
    const classNames = [styles.buttonsBar];
    switch (at){
        case "left": classNames.push(styles.left); break;
        case "right": classNames.push(styles.right); break;
        default: classNames.push(styles.bottom); break;
    }
    if (className) classNames.push(className as string);
    return <div class={classNames.join(' ')} {...divProps}>
        {props.children}
    </div>
}