import { CloseButton, PageLayout } from "@components";

export function Carnaval() {
  return <PageLayout title='Карнавал'>
    <CloseButton goTo="/main"/>
    <div class="text colorMediumBlue" style={{marginTop: 20, marginBottom: 16}}>Будет карнавал!</div>
    <div class="text colorMediumBlue">Вечером субботы, 20 июля в 16:00, по всей территории фестиваля пройдет костюмированное шествие под живую музыку,
      с барабанами и трубами.</div>
    <div class="text colorMediumBlue">Присоединяйтесь, будет весело и ярко!</div>
  </PageLayout>
}
