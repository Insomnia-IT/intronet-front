import Styles from "./button.module.css";
import {FunctionalComponent} from "preact";

export type ButtonProps = {
  isLoading?: boolean;
  solid?: boolean;
  selected?: boolean;
  type?: 'frame'|'blue'|'disco'|'vivid';
} & React.JSX.HTMLAttributes<HTMLButtonElement>
export const Button: FunctionalComponent<ButtonProps> = ({className, type, ...props}) => {
  const classNames = [Styles.button, className].filter(x => x);
  if (props.selected)
    classNames.push(Styles.selected)
  if (type)
    classNames.push(Styles[type]);
  return <button {...props} className={classNames.join(' ')}/>
}
