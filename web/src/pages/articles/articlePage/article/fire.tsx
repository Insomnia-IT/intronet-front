import { CloseButton, Link, PageLayout } from "@components";

export function Fire() {
  return (
    <PageLayout title="Костры" withCloseButton>
        <div>
          Сейчас в России действуют строгие правила пожарной безопасности. На
          походные газовые горелки в этом законе прямого запрета нет.
        </div>
        <div>
          Если случилась беда — <b>подходите к волонтёрам с рацией</b>. На
          территории работают службы, которые помогут.
        </div>
        <div>
          Ещё на поле есть костёр у Фудкорта. Тут нельзя
          готовить, но можно отдохнуть и погреться!
        </div>
        <Link goTo="/map" query={{ name: "костер" }}>
          к костру у фудкорта
        </Link>
      <CloseButton goTo="/main"/>
    </PageLayout>
  );
}
