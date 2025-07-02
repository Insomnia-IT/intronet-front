import { Button, ButtonsBar, CloseButton, Link, PageLayout } from "@components";

export function Theater() {
  return (
    <PageLayout title="тЯтр" gap="5">
      <CloseButton goTo="/main" />
      <div class="text">
      «тЯтр» — это живое театральное пространство, дающее свободу самовыражения через многообразие средств перформативных
       практик. Мы создаем платформу для искусства без границ, где каждый творческий замысел может обрести жизнь.
      </div>
      <Link style={{ marginTop: -8 }} goTo="/activities" query={{ name: "тЯтр" }}>
      к расписанию тЯтра
      </Link>
      {/*<Link goTo="/activities">к расписанию тЯтра</Link>*/}
      <ButtonsBar at="bottom">
        <Button type="blue" class="w-full" goTo={["map", { name: "тятр" }]}>
          к тЯтру
        </Button>
      </ButtonsBar>
    </PageLayout>
  );
}
