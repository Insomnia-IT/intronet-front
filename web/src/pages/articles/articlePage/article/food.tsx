import { Button, ButtonsBar, CloseButton } from "@components";
import { Link } from "@components";
import { Directions } from "@stores";
import { PageLayout } from "@components/PageLayout";
import { Tag, Tags } from "@components/tag";
import { useRouter } from "../../../routing";
import { useEffect } from "preact/hooks";
import { SvgIcon } from "@icons";

export function Food() {
  const router = useRouter();
  const section = router.route[2] as keyof typeof sections | undefined;
  const goTo = (section, replace = false) => {
    router.goTo(["articles", "food", section], {}, replace);
  };
  useEffect(() => {
    if (!section) {
      goTo(Object.keys(sections)[0], true);
    }
  }, [!!section]);
  const Component = sections[section]?.component;
  return (
    <PageLayout title="Еда" withCloseButton>
      <Tags
        tagsList={Object.keys(sections)}
        style={{ marginTop: 28, marginBottom: 8 }}
      >
        {(x) => (
          <Tag
            key={x}
            value={x}
            onClick={() => goTo(x)}
            selected={x === section}
          >
            {sections[x].title}
          </Tag>
        )}
      </Tags>
      <div flex column gap="5" class="text">
        <Component />
      </div>
    </PageLayout>
  );
}
const sections = {
  food: {
    title: "Фудкорт и кафе",
    component: () => (
      <>
        <div flex column gap="2">
          <div>
            Кафе разбросаны по всему фестивалю, но больше всего их на фудкорте.
          </div>
          <Link goTo="/map" query={{ name: "фудкорт" }}>
            к фудкорту
          </Link>
        </div>
        <div flex column gap="2">
          <div>
            В меню есть горячая еда и напитки. Есть вегетерианские и веганские
            блюда.
          </div>
          <div>Детей от 3 лет накормят в детском кафе «Глаз да глаз».</div>
          <Link goTo="/map" query={{ name: "глаз да глаз" }}>
            к детскому кафе
          </Link>
        </div>
        <div>Детское питание для малышей младше нужно привозить с собой!</div>
        <div className="colorOrange" flex gap="3">
          <SvgIcon
            id="#alert"
            size={24}
            style={{ color: "var(--ch-orange)", flex: "auto 0 0" }}
          />
          <span>
            В кафе нет одноразовых стаканов. Приходите со своим или можно взять
            фестивальный многоразовый стакан под залог в одном из
            <Link
              style={{ color: "var(--ch-orange)" }}
              goTo="/map"
              query={{ tag: "капшеринг" }}
            >
              {" Капшерингов"}
            </Link>
          </span>
        </div>
        <div>
          Рядом с кафе организованы места с проточной водой и чистящими
          средствами, чтобы мыть свою посуду.
        </div>
        <ButtonsBar at="bottom">
          <Button
            type="blue"
            class="w-full"
            goTo={["map", { direction: Directions.cafe }]}
          >
            все кафе на карте
          </Button>
        </ButtonsBar>
      </>
    ),
  },
  fire: {
    title: "Костёр",
    component: () => (
      <>
        <div>
          Сейчас в России действуют строгие правила пожарной безопасности. На
          походные газовые горелки в этом законе прямого запрета нет.
        </div>
        <div>
          Если случилась беда — <b>подходите к волонтёрам с рацией</b>. На
          территории работают службы, которые помогут.
        </div>
        <div>
          Ещё на поле есть два костра у Фудкорта и у Детского лагеря. Тут нельзя
          готовить, но можно отдохнуть и погреться!
        </div>
        <Link goTo="/map" query={{ name: "костер" }}>
          к костру у фудкорта
        </Link>
        <Link goTo="/map" query={{ name: "костер" }}>
          к костру у детской поляны
        </Link>
      </>
    ),
  },
};
