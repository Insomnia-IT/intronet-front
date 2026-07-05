import { Button, ButtonsBar, CloseButton, Link, PageLayout } from "@components";

export function Theater() {
  return (
    <PageLayout title="Театр в тумане" gap="5">
      <CloseButton goTo="/main" />
      <div class="text">
      «Театр в тумане» — это живое театральное пространство, дающее свободу самовыражения через многообразие средств перформативных практик.
       Мы создаем платформу для искусства без границ, где каждый творческий замысел может обрести жизнь.
      </div>
      <Link goTo={['activities',{name: 'Театр в тумане'}]}>
      к расписанию театра
      </Link>
      {/*<Link goTo="/activities">к расписанию тЯтра</Link>*/}
      <ButtonsBar at="bottom">
        <Button type="blue" class="w-full" goTo={["map", { name: "Театр в тумане" }]}>
          к театру
        </Button>
      </ButtonsBar>
    </PageLayout>
  );
}
