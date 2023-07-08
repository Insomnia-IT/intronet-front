import {useRouter} from "../../routing";
import {FunctionalComponent} from "preact";
import {About} from "./article/about";
import {Animation} from "./article/animation";
import {Child} from "./article/child";
import {Dogs} from "./article/dogs";
import {Eco} from "./article/eco";
import {Food} from "./article/food";
import {Living} from "./article/living";
import {Medical} from "./article/medical";
import {Phone} from "./article/phone";
import {Theater} from "./article/theater";
import {Tochka} from "./article/tochka";
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
  wc: WC,
  tochka: Tochka,
  dogs: Dogs,
  medical: Medical,
  theatre: Theater
}
