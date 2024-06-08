import {Button, ButtonsBar, CloseButton, Link, PageLayout} from "@components";

export function Theater() {
  return <PageLayout title='тЯтр' gap="5">
    <CloseButton goTo="/main"/>
    <div class="text">
      Новая площадка на «Бессоннице»! Тятр — это особенная сцена, где вся театральная работа, обычно спрятанная от глаз
      зрителей, будет на виду. Гости смогут нырнуть с головой в закулисье и узнать, как создаются костюмы, декорации,
      сюжеты спектаклей и перевоплощения актеров.
    </div>
    <div class="text">
      Мы пригласим вас на репетиции, мастер-классы по актерскому мастерству на нашей сцене, а в бутафорском и
      костюмерном цехе поможем создать образ и познакомим с удивительными техниками театрального оформления.
    </div>
    <Link goTo="/activities">к расписанию тЯтра</Link>
    <ButtonsBar at="bottom">
      <Button type="blue" class="w-full"  goTo={['map',{name: 'тятр'}]}>к тЯтру</Button>
    </ButtonsBar>
  </PageLayout>
}
