import { FunctionalComponent } from "preact";
import { SvgIcon } from "@icons";
import Styles from "./search-plug.module.css";

export interface SearchPlugProps {
  title: string;
  text: string;
}

export const SearchPlug: FunctionalComponent<SearchPlugProps> = ({
  title,
  text
                                                                 }) => {
  return (
    <div className={Styles.container}>
      <SvgIcon id="#eye-plug" size={ 90 } style={ 'margin-bottom: 16px' }/>
      <div className="sh1 colorMediumBlue">{title}</div>
      <div className="text colorMediumBlue" style={ 'text-align: center' }>
        {text}
      </div>
    </div>
  )
}
