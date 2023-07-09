import {Button, ButtonsBar, CloseButton} from "@components";
import {Card} from "@components/cards";
import {SvgIcon} from "@icons";
import {useRouter} from "../../../routing";

export function Carnaval() {
  return <div class="page colorMediumBlue" flex gap="4">
    <h1>Карнавал</h1>
    <CloseButton goTo="/main"/>
    <div>Будет карнавал!</div>
    <div>Вечером субботы, 15 июля в 16:00, по всей территории фестиваля пройдет костюмированное шествие под живую музыку,
      с барабанами и трубами.</div>
    <div>Присоединяйтесь, будет весело и ярко!</div>
  </div>
}
