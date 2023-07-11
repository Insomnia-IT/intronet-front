import {Button, ButtonsBar, CloseButton} from "@components";
import {Link} from "@components/link/link";
import {locationsStore} from "@stores";
import {useRouter} from "../../../routing";

export function Music() {
  const router = useRouter();
  if (router.route[2] === 'schedule')
    return <MusicSchedule/>
  const location = locationsStore.findByName('музыкальная');
  return <div class="page colorMediumBlue" flex gap="4">
    <h1>Музыка</h1>
    <CloseButton goTo="/main"/>
    <div>В лайнапе «Бессонницы» этого года — Краснознаменная дивизия имени моей бабушки, Нотэбёрд 2.0, Secrets of the
      third planet, Samosad bend, ОРК и КО, Vespero, Фёдор Ларюшкин и десятки других групп и музыкантов.
    </div>
    <Link style={{marginBottom: 8}} goTo={['activities','location',location._id]}>расписание муз сцена</Link>
    <div>Легендарная Бессонничная Карусель снова будет крутиться, звучать, сиять и дымить!</div>
    <Link goTo="/map" query={{name: 'заря'}}>к заре</Link>
  </div>
}

const MusicSchedule = () => {
  return <div className="page colorMediumBlue" flex gap="4">
    <h1>Муз. сцена</h1>
    <CloseButton goTo="/main"/>

    <ButtonsBar at="bottom">
      <Button type="vivid" goTo={['map', {name: 'музыкальная'}]} class="w-full">к муз. сцене</Button>
    </ButtonsBar>
  </div>
}
