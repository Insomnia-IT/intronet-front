import {useRouter} from "../../routing";
import {FunctionalComponent} from "preact";
import {About} from "./article/about";
import {Animation} from "./article/animation";
import {Child} from "./article/child";
import {Eco} from "./article/eco";
import {Food} from "./article/food";
import {Living} from "./article/living";
import {Phone} from "./article/phone";
import {Water} from "./article/water";
import {WC} from "./article/wc";

export const ArticlePage: FunctionalComponent = () => {
  const {route} = useRouter();
  const Article = articles[route[1] as keyof typeof articles];
  return <Article/>;
}

const articles: Record<string, FunctionalComponent> = {
  living: Living,
  eco: Eco,
  food: Food,
  animation: Animation,
  water: Water,
  phone: Phone,
  insight: About,
  child: Child,
  wc: WC
}
