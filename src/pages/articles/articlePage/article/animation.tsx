import {CloseButton} from "@components";
import {Card} from "@components/cards";
import {useRouter} from "../../../routing";

export function Animation() {
  const router = useRouter();
  return <div class="page" flex gap="4">
    <h1>Анимация</h1>
    <CloseButton goTo="/main"/>
    <div class="text colorMediumBlue" style={{marginTop: 20, marginBottom: 16}}>
      В этом году на фестивале будет три больших экрана, на которых мы покажем более 200 мультфильмов.
      <br/><br/>
      Показы идут ночью с 21:00  Показы разбиты на блоки (ТУТ ИНФА ПРО БЛОКИ, ЧТОБЫ БЫЛО ПРОЩУ ОРИЕНТИРОВАТЬСЯ В РАСПИСАНИИ)
      <br/><br/>
      Понравившиеся мультфильмы можно сохранить в Избранное, а ещё за лучший можно проголосовать!
    </div>
    <Card border="Vivid" onClick={() => router.goTo(['voting'])}>
      <h2 class="colorPink">Международный конкурс анимации </h2>
      <div class="text colorMediumBlue">Приз зрительских симпатий</div>
    </Card>
  </div>
}
