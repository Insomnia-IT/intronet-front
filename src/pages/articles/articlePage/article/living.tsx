import {Button, ButtonsBar, CloseButton} from "@components";
import {Link} from "@components/link/link";
import {Tag, Tags} from "@components/tag";
import {useEffect} from "preact/hooks";
import {useRouter} from "../../../routing";

export function Living() {
  const router = useRouter();
  const section = router.route[2] as keyof typeof sections | undefined;
  const goTo = (section, replace = false) => {
    router.goTo(['articles', 'living', section], {}, replace);
  }
  useEffect(() => {
    if (!section) {
      goTo(Object.keys(sections)[0], true);
    }
  }, [!!section]);
  const Component = sections[section]?.component;
  return <div class="page" flex gap="4">
    <div class="sh1">Жилье</div>
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
  camping: {
    title: "Кэмпинг", component: () => <div class="text colorMediumBlue" flex column gap="4">
      <div>Палатку можно поставить бесплатно в специальной зоне кэмпинга.</div>
      <div class="colorOrange">На поле между фестивальными объектами и локациями, палатки ставить ЗАПРЕЩЕНО!</div>
      <Footer/>
      <ButtonsBar at="bottom">
        <Button type="vivid" class="w-full">к бесплатному лагерю</Button>
      </ButtonsBar>
    </div>
  }, tents: {
    title: "Прокат палаток", component: () => <div class="text colorMediumBlue" flex column gap="4">
      <div>Можно взять в аренду:</div>
      <ul class="styledList">
        <li>Палатку (есть несколько размеров)</li>
        <li>Спальник</li>
        <li>Коврик</li>
        <li>Надувные матрасы</li>
        <li>Складные стулья</li>
        <li>Походные сидушки</li>
      </ul>
      <div>Оплата аренды и залога происходит при получении. Если вы оставляли заявку на аренду заранее, то номер телефона
        является вашим номером заказа.</div>
      <ButtonsBar at="bottom">
        <Button type="vivid" class="w-full">к прокату палаток</Button>
      </ButtonsBar>
    </div>
  }, paid: {
    title: "Платные кэмпинги", component: () => <div class="text colorMediumBlue" flex column gap="2">
      <div>Если вы заранее купили билет в платный кэмпинг — вам сюда!</div>
      <Link goTo="/map/?name=Байка">к Лесному лагерю «Байка»</Link>
      <Link goTo="/map/?name=Байка">к Лагерю у Детской поляны</Link>
      <Link goTo="/map/?name=Байка">к Автолагерю</Link>
      <Footer/>
    </div>
  }, caravan: {
    title: "Караван", component: () => <div class="text colorMediumBlue" flex column gap="2">
      <div>Если вы заранее купили билет в палаточный отель Караван — вам сюда!</div>
      <Footer/>
      <ButtonsBar at="bottom">
        <Button type="vivid" class="w-full">к каравану</Button>
      </ButtonsBar>
    </div>
  }, yurt: {
    title: "Юрты", component: () => <div class="text colorMediumBlue" flex column gap="2">
      <div>Если вы заранее купили билет в Юрту — вам сюда!</div>
      <Footer/>
      <ButtonsBar at="bottom">
        <Button type="vivid" class="w-full">к юртам</Button>
      </ButtonsBar>
    </div>
  },
}

const Footer = () => <>
  <div class="sh2">Очень важно, прочитайте:</div>
  <Link goTo="/articles/eco">экологические правила</Link>
  <Link goTo="/articles/fire">пожарная безопасность</Link>
  <div>Будьте осторожны: в лесах может попадаться колючая проволока и другие артефакты времен войны.</div>
</>
