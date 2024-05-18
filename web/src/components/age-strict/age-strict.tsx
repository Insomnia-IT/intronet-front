import { FunctionalComponent } from "preact";
import { Badge } from "../badge/badge";

export const AgeStrict: FunctionalComponent<{
  age: 12 | 16 | 18;
}> = ({ age }) => {
  return <Badge type={`Age${age}`} />;
};
