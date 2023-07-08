import {Button, ButtonsBar, CloseButton} from "@components";
import {Card} from "@components/cards";
import {Link} from "@components/link/link";
import {Tag, Tags} from "@components/tag";
import {SvgIcon} from "@icons";
import {useEffect} from "preact/hooks";
import {useRouter} from "../../../routing";

export function WC() {
  const router = useRouter();
  const section = router.route[2] as keyof typeof sections | undefined;
  const goTo = (section, replace = true) => {
    router.goTo(['articles', 'wc', section], {}, replace);
  }
  useEffect(() => {
    if (!section) {
      goTo(Object.keys(sections)[0]);
    }
  }, [!!section]);
  const Component = sections[section]?.component;
  console.log(sections, section, Component)
  return <div class="page" flex gap="4">
    <div class="sh1">о Портале Insight</div>
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
  wc: {
    title: "Туалеты", component: () => <div class="text colorMediumBlue" flex column gap="4">
      <div>Туалеты у нас деревенского типа — деревянные, с дыркой в полу. Экологичные и с хорошей вентиляцией — самые
        подходящие для массового мероприятия на природе :)</div>
      <div>Раз в день мы проводим санитарную обработку кабинок мойками высокого давления и засыпаем ямы специальными
        средствами от запаха.</div>
      <div>Туалетной бумаги в кабинках нет.</div>
      <ButtonsBar at="bottom">
        <Button type="vivid" class="w-full" goTo="/map?direction=туалет">к туалетам</Button>
      </ButtonsBar>
    </div>
  },
  free_shower: {
    title: "Бесплатный душ", component: () => <div class="text colorMediumBlue" flex column gap="5">
      <div>Несколько душевых кабинок с нагретой солнцем водой — совершенно бесплатно.</div>
      <div>По утрам и после полудня вода может быть холодной.</div>
      <div>Пожалуйста, используйте дегтярное мыло — это натуральное средство, полезное для кожи, которое не вредит
        окружающей среде.</div>
      <div flex gap="3">
        <SvgIcon id="#alert" size={24} style={{color: "var(--medium-blue)", flex: 'auto 0 0'}}/>
        Купаться в реке запрещено!
      </div>
      <ButtonsBar at="bottom">
        <Button type="vivid" class="w-full" goTo="/map?direction=душ">к бесплатному душу</Button>
      </ButtonsBar>
    </div>
  },
  paid_shower: {
    title: "Платный душ", component: () => <div class="text colorMediumBlue" flex column gap="5">
      <div>Душевые кабинки с постоянно нагреваемой водой — платная услуга бессонницы.</div>
      <div>Пожалуйста, используйте дегтярное мыло — это натуральное средство, полезное для кожи, которое не вредит
        окружающей среде.</div>
      <div flex gap="3">
        <SvgIcon id="#alert" size={24} style={{color: "var(--medium-blue)", flex: 'auto 0 0'}}/>
        Купаться в реке запрещено!
      </div>
      <ButtonsBar at="bottom">
        <Button type="vivid" class="w-full" goTo="/map?direction=душ">к платному душу</Button>
      </ButtonsBar>
    </div>
  },
  sauna: {
    title: "Баня", component: () => <div class="text colorMediumBlue" flex column gap="5">
      <div>Горячая баня — платная услуга бессонницы.</div>
      <div>Пожалуйста, используйте дегтярное мыло — это натуральное средство, полезное для кожи, которое не вредит
        окружающей среде.
      </div>
      <ButtonsBar at="bottom">
        <Button type="vivid" class="w-full" goTo="/map?direction=баня">к бане</Button>
      </ButtonsBar>
    </div>
  },
  // river: {
  //   title: "Река", component: () => <div class="text colorMediumBlue" flex column gap="5">
  //     <div>Поляна Бессонницы большая, поэтому важно не оставлять маленьких детей одних. На фестивале работает Точка сборки — команда волонтеров, которая поможет в случае потери ребёнка.</div>
  //     <Link goTo="/articles/tochka">рекомендации Точки сборки</Link>
  //   </div>
  // }
}
