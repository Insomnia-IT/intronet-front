import {Button, ButtonsBar, CloseButton} from "@components";
import {Link} from "@components/link/link";
import {Tag, Tags} from "@components/tag";
import {Directions} from "@stores";
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
    <CloseButton goTo="/main"/>
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
      <Link goTo="/map" query={{name: 'фудкорт'}}>к фудкорту</Link>
      <div>В меню есть горячая еда и напитки. Есть вегетерианские и веганские блюда.</div>
      <div>Детей от 3 лет накормят в детском кафе «Глаз да глаз».</div>
      <Link goTo="/map" query={{name: 'глаз да глаз'}}>к детскому кафе</Link>
      <div>Детское питание для малышей младше нужно привозить с собой!</div>
      <div>На «Бессоннице» нет одноразовых стаканов. Приходите за напитками со своими кружками, стаканами, флягами и бутылочками!</div>
      <div>Если нет своей кружки — не страшно, в&nbsp;любом кафе вы можете взять фестивальный многоразовый стакан под залог 200&nbsp;рублей.</div>
      <div>Стакан можно оставить себе в&nbsp;качестве сувенира или вернуть деньги, сдав в&nbsp;Инфоцентр в конце фестиваля. 50&nbsp;рублей из&nbsp;залога мы удержим за&nbsp;пользование стаканом и его дальнейшую утилизацию.</div>
      <div>Для того, чтобы мыть свою посуду, на&nbsp;фестивале будут организованы общедоступные мойки с&nbsp;чистящими средствами.</div>
      <div>Рядом с&nbsp;кафе организованы места с&nbsp;проточной водой и чистящими средствами, чтобы мыть свою посуду.</div>
      <ButtonsBar at="bottom">
        <Button type="vivid" class="w-full" goTo={['map',{direction: Directions.cafe}]}>все кафе на карте</Button>
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
