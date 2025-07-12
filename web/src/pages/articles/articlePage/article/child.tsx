import {CloseButton} from "@components";
import {Link} from "@components";
import {Tag, Tags} from "@components/tag";
import {useEffect} from "preact/hooks";
import {useRouter} from "../../../routing";
import { PageLayout } from "@components/PageLayout";

export function Child() {
  const router = useRouter();
  const section = router.route[2] as keyof typeof sections | undefined;
  const goTo = (section, replace = true) => {
    router.goTo(['articles', 'child', section], {}, replace);
  }
  useEffect(() => {
    if (!section) {
      goTo(Object.keys(sections)[0]);
    }
  }, [!!section]);
  const Component = sections[section]?.component;
  return <PageLayout title='Я с ребёнком'>
    <CloseButton goTo="/main"/>
    <Tags tagsList={Object.keys(sections)} style={{marginTop: 28, marginBottom: 8}}>
      {x => <Tag
        key={x}
        value={x}
        onClick={() => goTo(x)}
        selected={x === section}>{sections[x].title}</Tag>}
    </Tags>
    {Component && <Component/>}
  </PageLayout>
}

const sections = {
  fun: {
    title: "Развлечения", component: () => <div class="text" flex column gap="4">
      <div>Этим летом Детская поляна превращается в театральные подмостки. В программе спектакли наших старых друзей и
        новых коллективов, шоу иллюзий и, конечно мультики по вечерам. А волшебники-мастера научат разным фокусам и
        трюкам, которые будут интересны детям и взрослым.</div>
      <div>Дети не останутся без вкусной еды, на детской поляне работает уютное кафе «Глаз да глаз».</div>
      <Link goTo={['map',{name: 'глаз да глаз'}]}>кафе на карте</Link>
      <div class="sh2" style={{marginTop: 15}}>Развлечения днём</div>
      <div>Интересные лекции, увлекательные мастер-классы и игры в детском шатре.</div>
      <Link goTo={['activities',{name: 'детская поляна'}]}>расписание детской поляны</Link>
      <div class="sh2" style={{marginTop: 15}}>Анимация ночью</div>
      <div>У детской поляны есть свой экран.</div>
      <Link goTo={['map',{name: 'детский экран'}]}>детский экран на карте</Link>
      <div style={{marginTop: 15}}>В Диафильминариуме ночью показ редчайших диафильмов с живым озвучанием.</div>
      <Link goTo={['map',{name: 'диафильминариум'}]}>диафильминариум на карте</Link>
      <div style={{marginTop: 15}}>На основных экранах первым блоком идет анимация, рассчитанная на семейный просмотр.</div>
      <Link goTo={['map',{name: 'речной'}]}>речной экран на карте</Link>
      <Link goTo={['map',{name: 'полевой'}]}>полевой экран на карте</Link>
    </div>
  },
  safety: {
    title: "Безопасность", component: () => <div class="text" flex column gap="5">
      <div>Поляна «Бессонницы» большая, поэтому важно не оставлять маленьких детей одних. На фестивале работает Точка сборки — команда волонтеров, которая поможет в случае потери ребёнка.</div>
      <Link goTo="/articles/tochka">рекомендации Точки сборки</Link>
    </div>
  }
}
