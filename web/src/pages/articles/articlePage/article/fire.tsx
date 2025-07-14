import { CloseButton, Link, PageLayout } from "@components";

export function Fire() {
  return (
    <PageLayout title="Костры" withCloseButton gap="4">
    <CloseButton goTo="/main"/>
        <div class="text">
          Сейчас в России действуют строгие правила пожарной безопасности. На
          походные газовые горелки в этом законе прямого запрета нет.
        </div>
        <div class="text">
          Если случилась беда — <b>подходите к волонтёрам с рацией</b>. На
          территории работают службы, которые помогут.
        </div>
        <div class="text">
          Ещё на поле есть костёр у Фудкорта. Тут нельзя
          готовить, но можно отдохнуть и погреться! А ещё около него проходят различиные мероприяития.
        </div>
        <Link goTo="/map" query={{ name: "костёр" }}>
          к костру у фудкорта
        </Link>
      
    </PageLayout>
  );
}
