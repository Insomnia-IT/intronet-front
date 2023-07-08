import {CloseButton} from "@components";
import {Card} from "@components/cards";
import {Tag, Tags} from "@components/tag";
import {useEffect} from "preact/hooks";
import {useRouter} from "../../../routing";

export function About() {
  const router = useRouter();
  const section = router.route[2] as keyof typeof sections | undefined;
  const goTo = (section, replace = true) => {
    router.goTo(['articles', 'insight', section], {}, replace);
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
  about: {
    title: "О портале", component: () => <div class="text colorMediumBlue" flex column gap="4">
      <div>
        Insight работает с помощью внутренней сети «Insomnia-WIFI», которая доступна только на территории фестиваля.
      </div>
      <div class="sh2">Точки сети находятся у Инфоцентра, Речного и Полевого экрана.</div>
      <div>Заходить на другие сайты нельзя, но можно наслаждаться порталом, даже если нет подключения к сети.</div>
      <div>На фестивале все быстро меняется. Чтобы быть в курсе изменений, рекомендуем иногда подключаться к сети и открывать приложение, чтобы обновить данные.</div>
    </div>
  },
  fast: {
    title: "Быстрый доступ", component: () => <div class="text colorMediumBlue" flex column gap="5">
      <ol>
        <li>Присоединяйся к сети «insomnia-WIFI» у Инфоцентра, Речного или Полевого экрана.</li>
        <li>Сканируй QR-код или переходи по ссылке insight.app в браузере.</li>
      </ol>
    </div>
  },
  share: {
    title: "Поделиться с другом", component: () => <div class="text colorMediumBlue" flex column gap="5">
      <div>Чтобы иметь быстрый доступ к порталу с домашнего экрана телефона, нужно:</div>
      <div>на телефонах Android:</div>
      <Card border="Blue">
        <div>Google Chrome</div>
        <div>Нажмите на <ThreePoint/> справа вверху и выберите «Установить приложение»</div>
      </Card>
      <Card border="Blue">
        <div>Яндекс Браузер</div>
        <div>Нажмите на <Burger/> справа внизу и выберите «Добавить ярлык»</div>
      </Card>
      <div>на Iphone:</div>
      <Card border="Blue">
        <div>Safari</div>
        <div>Нажмите на <SufariButton/> внизу<br/> выберите «Добавить на домашний экран» и затем «Добавить»</div>
      </Card>
      <Card border="Blue">
        <div>Google Chrome</div>
        <div>Нажмите на <SufariButton/> вверху<br/> выберите «Добавить на домашний экран» и затем «Добавить»</div>
      </Card>
      <Card border="Blue">
        <div>Яндекс Браузер</div>
        <div>Нажмите на <Burger/> справа внизу и выберите «Добавить ярлык»</div>
      </Card>
    </div>
  }
}

const ThreePoint = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <rect width="24" height="24" rx="12" fill="#536BF3"/>
  <path d="M12 12H12.01M12 6.42857H12.01M12 17.5714H12.01M13 12C13 12.5128 12.5523 12.9286 12 12.9286C11.4477 12.9286 11 12.5128 11 12C11 11.4872 11.4477 11.0714 12 11.0714C12.5523 11.0714 13 11.4872 13 12ZM13 17.5714C13 18.0843 12.5523 18.5 12 18.5C11.4477 18.5 11 18.0843 11 17.5714C11 17.0586 11.4477 16.6429 12 16.6429C12.5523 16.6429 13 17.0586 13 17.5714ZM13 6.42857C13 6.94141 12.5523 7.35714 12 7.35714C11.4477 7.35714 11 6.94141 11 6.42857C11 5.91574 11.4477 5.5 12 5.5C12.5523 5.5 13 5.91574 13 6.42857Z" stroke="#F7FCFF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
</svg>;
  const Burger = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="12" fill="#536BF3"/>
    <path d="M7 8H17M7 12H17M7 16H17" stroke="#F7FCFF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

const SufariButton = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <rect width="24" height="24" rx="12" fill="#536BF3"/>
  <path d="M8.66667 10.125H8.13333C7.3866 10.125 7.01323 10.125 6.72801 10.2749C6.47713 10.4067 6.27316 10.617 6.14532 10.8758C6 11.1699 6 11.5549 6 12.325V14.8C6 15.5701 6 15.9551 6.14532 16.2492C6.27316 16.508 6.47713 16.7183 6.72801 16.8501C7.01323 17 7.3866 17 8.13333 17H15.8667C16.6134 17 16.9868 17 17.272 16.8501C17.5229 16.7183 17.7268 16.508 17.8547 16.2492C18 15.9551 18 15.5701 18 14.8V12.325C18 11.5549 18 11.1699 17.8547 10.8758C17.7268 10.617 17.5229 10.4067 17.272 10.2749C16.9868 10.125 16.6134 10.125 15.8667 10.125H15.3333M12 6V14.25M12 6L10 8.0625M12 6L14 8.0625" stroke="#F7FCFF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

