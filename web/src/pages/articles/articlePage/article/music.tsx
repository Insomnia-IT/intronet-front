import { Button, ButtonsBar, CloseButton, PageLayout, Link } from "@components";
import { locationsStore } from "@stores";

export function Music() {
  const location = locationsStore.findByName('музыкальная');
  return <PageLayout title='Музыка'>
    <CloseButton goTo="/main"/>
    <div>В лайнапе «Бессонницы» этого года — Краснознаменная дивизия имени моей бабушки, Нотэбёрд 2.0, Secrets of the
      third planet, Samosad bend, ОРК и КО, Vespero, Фёдор Ларюшкин и десятки других групп и музыкантов.
    </div>
    <Link style={{marginBottom: 8}} goTo={['activities','location',location._id]}>расписание муз сцена</Link>
    {/* <div>Легендарная Бессонничная Карусель снова будет крутиться, звучать, сиять и дымить!</div>
    <Link goTo="/map" query={{name: 'заря'}}>к заре</Link>
    <ButtonsBar at="bottom">
      <Button type="blue" goTo={['map', {name: 'музыкальная'}]} class="w-full">к муз. сцене</Button>
    </ButtonsBar> */}
  </PageLayout>
}
