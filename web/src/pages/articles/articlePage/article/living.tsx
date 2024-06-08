import {Button, ButtonsBar, CloseButton, Link, Tag, Tags} from "@components";
import {SvgIcon} from "@icons";
import {useEffect} from "preact/hooks";
import {useRouter} from "../../../routing";
import { PageLayout } from "@components/PageLayout";

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
  return <PageLayout title='Жилье' >
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
  camping: {
    title: "Кемпинг", component: () => <div class="text colorMediumBlue" flex column gap="4">
      <div>Палатку можно поставить бесплатно в специальной зоне кэмпинга.</div>
      <div class="colorOrange" flex gap="3">
        <SvgIcon id="#alert" size={24} style={{ color: "var(--ch-orange)", flex: 'auto 0 0' }} />
        На поле между фестивальными объектами и локациями, палатки ставить запрещено
      </div>
      <Footer/>
      <ButtonsBar at="bottom">
        <Button type="blue" class="w-full" goTo={['map',{direction: 'бесплатный лагерь'}]}>
          к бесплатным лагерям
        </Button>
      </ButtonsBar>
    </div>
  }, tents: {
    title: "Прокат палаток", component: () => <div class="text colorMediumBlue" flex column gap="4">
      <div>Можно взять в аренду:</div>
      <ul class="disc" style={{margin: '4px 0'}}>
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
        <Button type="blue" class="w-full" goTo={['map',{name: 'прокат'}]}>к прокату палаток</Button>
      </ButtonsBar>
    </div>
  }, paid: {
    title: "Платные кемпинги", component: () => <div class="text colorMediumBlue" flex column gap="2">
      <div  style={{marginBottom: 8}}>Если вы заранее купили билет в платный кемпинг — вам сюда!</div>
      <Link goTo="/map" query={{name: 'байка'}} style={{margin: '10px 0'}}>к Лесному лагерю «Байка»</Link>
      <Link goTo="/map" query={{name: 'у детской'}} style={{margin: '10px 0'}}>к Лагерю у Детской поляны</Link>
      <Link goTo="/map" query={{name: 'автолагерь'}} style={{margin: '10px 0 24px'}}>к Автолагерю</Link>
      <Footer/>
    </div>
  }, caravan: {
    title: "Караван", component: () => <div class="text colorMediumBlue" flex column gap="2">
      <div  style={{marginBottom: 8}}>Если вы заранее купили билет в палаточный отель Караван — вам сюда!</div>
      <Footer/>
      <ButtonsBar at="bottom">
        <Button type="blue" class="w-full" goTo={['map',{name: 'караван'}]}>к каравану</Button>
      </ButtonsBar>
    </div>
  }, yurt: {
    title: "Юрты", component: () => <div class="text colorMediumBlue" flex column gap="2">
      <div  style={{marginBottom: 8}}>Если вы заранее купили билет в Юрту — вам сюда!</div>
      <Footer/>
      <ButtonsBar at="bottom">
        <Button type="blue" class="w-full" goTo={['map',{name: 'юрты'}]}>к юртам</Button>
      </ButtonsBar>
    </div>
  },
}

const Footer = () => <>
  <div flex column gap="4">
    <div class="sh2" style={{marginTop: 8}}>Очень важно, прочитайте:</div>
    <Link goTo="/articles/eco" style={{margin: '8px 0'}}>экологические правила</Link>
    <Link goTo="/articles/fire" style={{margin: '4px 0px 8px'}}>пожарная безопасность</Link>
    <div>Будьте осторожны: в лесах может попадаться колючая проволока и другие артефакты времен войны.</div>
  </div>
</>
