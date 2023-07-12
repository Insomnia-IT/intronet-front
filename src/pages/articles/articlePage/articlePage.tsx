import {useRouter} from "../../routing";
import {FunctionalComponent} from "preact";
import {About} from "./article/about";
import {Animation} from "./article/animation";
import {Ants} from "./article/ants";
import {Art} from "./article/art";
import {Car} from "./article/car";
import {Carnaval} from "./article/carnaval";
import {Child} from "./article/child";
import {Dogs} from "./article/dogs";
import {Eco} from "./article/eco";
import {Fire} from "./article/fire";
import {Food} from "./article/food";
import {Game} from "./article/game";
import {Living} from "./article/living";
import {Medical} from "./article/medical";
import {Music} from "./article/music";
import {Phone} from "./article/phone";
import {Shops} from "./article/shops";
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
  theatre: Theater,
  shops: Shops,
  art: Art,
  music: Music,
  carnaval: Carnaval,
  game: Game,
  ants: Ants,
  carFailure: Car,
  fireplace: Fire,
  fire: Fire,
}
