import { FunctionalComponent } from "preact";
import { Badge } from "../badge/badge";

export type AgeStrictValue = 6 | 12 | 16 | 18;

export const AgeStrict: FunctionalComponent<{
  age: AgeStrictValue;
  className?: string;
}> = ({ age, className }) => {
  return <Badge type={`Age${age}`} className={className} />;
};

export const isAgeBadgeVisible = (age?: number): boolean =>
  age !== undefined && age >= 12;
