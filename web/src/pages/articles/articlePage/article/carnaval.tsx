import { CloseButton, PageLayout } from "@components";

export function Carnaval() {
  return <PageLayout title='Карнавал'>
    <CloseButton goTo="/main"/>
    <div>Будет карнавал!</div>
    <div>Вечером субботы, 15 июля в 16:00, по всей территории фестиваля пройдет костюмированное шествие под живую музыку,
      с барабанами и трубами.</div>
    <div>Присоединяйтесь, будет весело и ярко!</div>
  </PageLayout>
}
