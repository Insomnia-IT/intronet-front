import {Button, ButtonsBar, CloseButton} from "@components";

export function Phone() {
  return <div class="page" flex gap="4">
    <h1>Зарядить телефон</h1>
    <CloseButton goTo="/main"/>
    <div class="text colorMediumBlue" style={{marginTop: 20, marginBottom: 16}}>
      Зарядка мобильного телефона или другого гаджета — одна из платных услуг на «Бессоннице». Обращайтесь в инфоцентр.
    </div>
    <ButtonsBar at="bottom">
      <Button type="vivid" class="w-full" goTo={['map',{name: 'инфоцентр'}]}>к инфоцентру</Button>
    </ButtonsBar>
  </div>
}
