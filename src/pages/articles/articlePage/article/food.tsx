import {Button, ButtonsBar, CloseButton} from "@components";
import {Link} from "@components/link/link";
import {Tag, Tags} from "@components/tag";
import {useEffect} from "preact/hooks";
import {useRouter} from "../../../routing";

export function Food() {
  const router = useRouter();
  const section = router.route[2] as keyof typeof sections | undefined;
  const goTo = (section, replace = false) => {
    router.goTo(['articles', 'food', section], {}, replace);
  }
  useEffect(() => {
    if (!section) {
      goTo(Object.keys(sections)[0], true);
    }
  }, [!!section]);
  const Component = sections[section]?.component;
  return <div class="page" flex gap="4">
    <div class="sh1">Еда</div>
    <CloseButton/>
    <Tags tagsList={Object.keys(sections)}>
      {x => <Tag
        key={x}
        value={x}
        onClick={() => goTo(x)}
        selected={x === section}>{sections[x].title}</Tag>}
    </Tags>
    {Component && <Component/>}
  </div>
}

const sections = {
  cafe: {
    title: "Фудкорт и кафе", component: () => <div class="text colorMediumBlue" flex column gap="4">
      <div>Кафе разбросаны по всему фестивалю, но больше всего их на фудкорте.</div>
      <Link goTo="/map">к фудкорту</Link>
      <div>В меню есть горячая еда и напитки. Есть вегетерианские и веганские блюда.</div>
      <div>Детей от 3 лет накормят в детском кафе «Глаз да глаз».</div>
      <Link goTo="/map">к детскому кафе</Link>
      <div>Детское питание для малышей младше нужно привозить с собой!</div>
      <div>В кафе нет одноразовых стаканов. Приходите со своим или можно взять фестивальный многоразовый стакан под залог
        в одном из <Link goTo="/map">Капшерингов</Link></div>
      <div>Рядом с кафе организованы места с проточной водой и чистящими средствами, чтобы мыть свою посуду.</div>
      <ButtonsBar at="bottom">
        <Button type="vivid" class="w-full">все кафе на карте</Button>
      </ButtonsBar>
    </div>
  },
  fireplace: {
    title: "Костёр", component: () => <div class="text colorMediumBlue" flex column gap="4">
      <div>Сейчас в России действуют строгие правила пожарной безопасности. На походные газовые горелки в этом законе
        прямого запрета нет.</div>
      <div>
        Если случилась беда — <b>подходите к волонтёрам с рацией</b>. На территории работают службы, которые помогут.
      </div>
    </div>
  }
}
