import { Card, Button, ButtonsBar, CloseButton, PageLayout } from "@components";

export function Medical() {
  return <PageLayout title='Мед. пункт'>
    <CloseButton goTo="/main"/>
    <div class="sh1">В каком случае необходимо вызывать медиков?</div>
    <Card border="Blue">
      <ul class="disc">
        <li>Пострадавший не может самостоятельно передвигаться</li>
        <li>Когда самостоятельное передвижение \ транспортировка пострадавшего может привести к ухудшению его
          состояния (пример: человек упал и ударился спиной; в этом случае не стоит его шевелить, нужно вызвать и дождаться
          медиков)</li>
        <li>Пострадавший находится не в сознании \ наблюдается затруднение дыхания \ сильное кровотечение</li>
        <li>Есть очевидная прямая угроза жизни</li>
      </ul>
    </Card>
    <div>Если пострадавший может передвигаться самостоятельно и ему не требуется неотложная медицинская помощь (мозоль, клещи и т.п.) — <b>НЕ
      НУЖНО ВЫЗЫВАТЬ МЕДИКОВ.</b></div>
    <div>Расскажите человеку, где находится медпункт и сопроводите его туда.</div>
    <div class="sh1">Как вызвать медиков?</div>
    <Card border="Yellow">
      <ol>
        <li>Найдите на ближайшей площадке любого человека с рацией</li>
        <li>Опишите ситуацию и попроси вызвать медиков</li>
        <li>Встретьте медиков и проведите пострадавшего до мед. пункта</li>
      </ol>
    </Card>
    <ButtonsBar at="bottom">
      <Button type="vivid" class="w-full" goTo={['map', {name: 'медпункт'}]}>к мед. пункту</Button>
    </ButtonsBar>
  </PageLayout>
}
