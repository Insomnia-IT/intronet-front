import {Button, ButtonsBar, CloseButton} from "../../../../components";
import { PageLayout } from "@components/PageLayout";

export function Radio() {
  return <PageLayout title='Зарядить телефон'>
    <CloseButton goTo="/main"/>
    <div class="text" style={{marginTop: 20, marginBottom: 16}}>
      «Бессонное радио» — радиостанция, работающая исключительно в дни международного фестиваля авторской анимации «Бессонница».
      В нашем эфире:
      <ul class="styledList">
        <li>
          актуальные анонсы событий и изменения программы в режиме реального времени;
        </li>
        <li>
          интервью с авторами мультфильмов, организаторами фестиваля и приглашёнными гостями;
        </li>
        <li>
          музыкальные подборки, сопровождающие атмосферу фестиваля и продвигающие творчество его участников - музыкантов, журналистов, режиссеров, монтажеров и мультфильмистов
        </li>
      </ul>
    </div>
    <ButtonsBar at="bottom">
      <Button type="blue" class="w-full" goTo={['map',{name: 'инфоцентр'}]}>к инфоцентру</Button>
    </ButtonsBar>
  </PageLayout>
}
