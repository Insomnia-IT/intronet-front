import {Button, ButtonsBar, CloseButton} from "../../../../components";
import { PageLayout } from "@components/PageLayout";

export function Phone() {
  return <PageLayout title='Зарядить телефон'>
    <CloseButton goTo="/main"/>
    <div class="text colorMediumBlue" style={{marginTop: 20, marginBottom: 16}}>
      Зарядка мобильного телефона или другого гаджета — одна из платных услуг на «Бессоннице». Обращайтесь в Инфоцентр.
    </div>
    <ButtonsBar at="bottom">
      <Button type="blue" class="w-full" goTo={['map',{name: 'инфоцентр'}]}>к инфоцентру</Button>
    </ButtonsBar>
  </PageLayout>
}
