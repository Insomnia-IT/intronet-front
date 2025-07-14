import {Button, ButtonsBar, CloseButton} from "../../../../components";
import {Card} from "../../../../components/cards";
import {Link} from "../../../../components/link/link";
import {useRouter} from "../../../routing";
import { PageLayout } from "@components/PageLayout";

export function Animation() {
  const router = useRouter();
  return <PageLayout title='Программа показов'>
    <CloseButton style={{top: 20}} goTo="/main"/>
    <div>
      <div class="text colorGrey2">
        На наших экранах в течение 4 ночей будет показано более 200 анимационных фильмов. Экранов будет три: два основных и один на Детской поляне.
      </div>
      <Link goTo="/timetable">РАСПИСАНИЕ АНИМАЦИИ</Link>
      <div class="text colorGrey2" style={{margin: '16px 0 24px'}}>
        Понравившиеся мультфильмы можно сохранить в Избранное, а еще можно поучаствовать в Голосовании!
      </div>
    </div>
    <Card border="Vivid" onClick={() => router.goTo(['voting'])}>
      <h2 class="colorGradient" style={{margin: 0}}>Международный конкурс анимации</h2>
      <div class="text colorGrey2" style={{margin: 0}}>Приз зрительских симпатий</div>
    </Card>
    <ButtonsBar style={{bottom: 40}}>
      <Button type="blue" class="w-full" goTo="/timetable">
        к расписанию
      </Button>
    </ButtonsBar>
  </PageLayout>
}
