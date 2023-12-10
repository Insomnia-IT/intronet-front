import { FunctionalComponent } from "preact";
import style from "./age.module.css";
import { Badge } from "../badge/badge";

export const AgeStrict: FunctionalComponent<{
  age: 12 | 16 | 18;
}> = ({ age }) => {
  return <Badge type={`Age${age}`} />;
};
