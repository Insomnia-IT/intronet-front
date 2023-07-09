import {Button, ButtonsBar, CloseButton} from "@components";
import {Card} from "@components/cards";
import {Link} from "@components/link/link";
import {SvgIcon} from "@icons";
import {useRouter} from "../../../routing";

export function Theater() {
  return <div class="page text colorMediumBlue" flex gap="4">
    <h1>тЯтр</h1>
    <CloseButton goTo="/main"/>
    <div class="sh1">Новая площадка на Бессоннице! </div>
    <div>Тятр — это особенная сцена, где вся театральная работа, обычно спрятанная от глаз
      зрителей, будет на виду. Гости смогут нырнуть с головой в закулисье и узнать, как создаются костюмы, декорации,
      сюжеты спектаклей и перевоплощения актеров.</div>
    <div>Мы пригласим вас на репетиции, мастер-классы по актерскому мастерству на нашей сцене, а в бутафорском и
      костюмерном цехе поможем создать образ и познакомим с удивительными техниками театрального оформления.</div>
    <Link goTo="/activities">к расписанию тЯтра</Link>
    <ButtonsBar at="bottom">
      <Button type="vivid" class="w-full" goTo="/map/?name=тятр">к тЯтру</Button>
    </ButtonsBar>
  </div>
}
