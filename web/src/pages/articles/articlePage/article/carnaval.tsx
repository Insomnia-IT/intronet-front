import { Button, ButtonsBar, CloseButton, Link, PageLayout } from "@components";

export function Carnaval() {
  return <PageLayout title='Карнавал'>
    <CloseButton goTo="/main"/>
    <div class="text" style={{marginTop: 20, marginBottom: 16}}>Будет карнавал!</div>
    <div class="text">Вечером субботы, 19 июля в 17:00, по всей территории фестиваля пройдет костюмированное шествие под живую музыку,
      с барабанами и трубами.</div>
    <div class="text">Присоединяйтесь, старт у тЯтра!</div>
          <ButtonsBar at="bottom">
            <Button type="blue" class="w-full" goTo={["map", { name: "тятр" }]}>
              к тЯтру
            </Button>
          </ButtonsBar>
  </PageLayout>
}
