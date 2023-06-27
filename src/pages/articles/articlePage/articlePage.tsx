import {useRouter} from "../../routing";
import {FunctionalComponent} from "preact";
import {Eco} from "./article/eco";
import {Food} from "./article/food";
import {Living} from "./article/living";

export const ArticlePage: FunctionalComponent = () => {
  const {route} = useRouter();
  const Article = articles[route[1] as keyof typeof articles];
  return <Article/>;
}

const articles: Record<string, FunctionalComponent> = {
  living: Living,
  eco: Eco,
  food: Food,
}
