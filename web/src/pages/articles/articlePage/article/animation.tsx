import {CloseButton} from "../../../../components";
import {Card} from "../../../../components/cards";
import {Link} from "../../../../components/link/link";
import {useRouter} from "../../../routing";
import { PageLayout } from "@components/PageLayout";

export function Animation() {
  const router = useRouter();
  return <PageLayout title='Программа показов'>
    <CloseButton goTo="/main"/>
    <div class="text" style={{marginTop: 20, marginBottom: 16}}>
      На наших экранах в течение 4 ночей будет показано более 200 анимационных фильмов. Экранов будет три: два основных и один на Детской поляне.
      <br/><br/>
      <Link goTo="/timetable">ССЫЛКА НА РАСПИСАНИЕ АНИМАЦИИ</Link>
      <br/><br/>
      Понравившиеся мультфильмы можно сохранить в Избранное, а еще можно поучаствовать в Голосовании!
    </div>
    <Card border="Vivid" onClick={() => router.goTo(['voting'])}>
      <h2 class="colorPink">РОССИЙСКИЙ НАЦИОНАЛЬНЫЙ КОНКУРС</h2>
      <div class="text">Приз зрительских симпатий</div>
    </Card>
  </PageLayout>
}
