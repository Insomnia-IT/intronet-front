import {Button, ButtonsBar, CloseButton} from "../../../../components";
import { PageLayout } from "@components/PageLayout";

export function Radio() {
  return <PageLayout title='Бессонное радио'>
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
    <div class="text colorMediumBlue" style={{marginTop: 20, marginBottom: 16}}>
      Для прослушивания необходимо подключение к Insomnia-Wi-Fi
    </div>
    <ButtonsBar at="bottom">
      <Button type="blue" class="w-full" href="http://radio.insomniafest.ru:8000/main_stream" target="_blank" rel="noopener noreferrer">слушать радио</Button>
    </ButtonsBar>
  </PageLayout>
}
