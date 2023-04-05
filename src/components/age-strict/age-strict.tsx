import { FunctionalComponent } from "preact";
import style from "./age.module.css";
export const AgeStrict: FunctionalComponent<{
  age: number;
}> = ({ age }) => {
  return (
    <div class={[style.age, style["age" + age]].filter((x) => x).join(" ")}>
      {age}+
    </div>
  );
};
