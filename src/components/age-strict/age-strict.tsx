import { FunctionalComponent } from "preact";
import style from "./age.module.css";
import { Badge } from "@components/badge/badge";

export const AgeStrict: FunctionalComponent<{
  age: 12 | 18;
}> = ({ age }) => {
  return <Badge type={`Age${age}`} />;
};
