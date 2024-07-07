import {Button, ButtonsBar, CloseButton} from "@components";
import { PageLayout } from "@components/PageLayout";

export function Ants() {
  return <PageLayout title='ПРО КЛЕЩЕЙ'>
    <CloseButton goTo="/main"/>

    <span class="text colorMediumBlue" style={{marginTop: 20, marginBottom: 16}}>
          На фестивале водятся комары, клещи и прочие кусачие насекомые.<br/><br/>
    Используйте репелленты!<br/><br/>
    Если вы обнаружили клеща, приходите в медпункт - поможем удалить.
    </span>

    <ButtonsBar at="bottom">
      <Button type="blue" class="w-full" goTo={['map', {name: 'медпункт'}]}>к медпункту</Button>
    </ButtonsBar>
  </PageLayout>
}
