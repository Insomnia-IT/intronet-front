import styles from "./onboard.module.css";
import { Button, ButtonsBar, CloseButton } from "../../components";
import { useEffect } from "preact/hooks";
import { useRouter } from "../routing";
import { useCell } from "../../helpers/cell-state";
import { userStore } from "../../stores/user.store";

export const OnboardPage = () => {
  const stage = useCell(() => userStore.OnboardingPhase);
  const router = useRouter();
  useEffect(() => {
    if (Number.isNaN(stage)) userStore.OnboardingPhase = 0;
    if (stage >= Stages.length) router.goTo(["main"], {}, true);
  }, [stage]);
  const Page = Stages[+stage] ?? (() => <></>);
  return (
    <div class={styles.pageOnboard}>
      <Page />
      <CloseButton white onClick={userStore.onboardingFinish} />
    </div>
  );
};

const OnboardStage1 = () => {
  return (
    <>
      <img className={styles.img1} src="/public/images/onboard1.png"/>
      <div style={{margin: 'auto'}}>
        <h1>
          Привет!
          <br />
          Это insight
        </h1>
        <div class="text">— полевой сайт «Бессонницы»</div>
      </div>
      <svg width="46" height="67" viewBox="0 0 46 67" fill="none"
           class={styles.star}
           xmlns="http://www.w3.org/2000/svg">
        <path d="M33.541 66.9922C32.4942 57.9025 31.452 48.8127 30.3923 39.5975L17.2032 49.9598L17.0909 49.8472L27.6368 36.8316L0.00878906 33.6805V33.5463L27.6368 30.3909L17.1686 17.2887L17.2941 17.1458L30.4049 27.6294C31.469 18.3145 32.5116 9.15551 33.5541 -0.0078125H33.6927L36.8372 27.6207L49.8404 17.0723L49.9658 17.1848L39.6058 30.3822L67.0086 33.5376V33.6718L39.61 36.823L49.8661 49.7087L49.7364 49.8516L36.8545 39.5888C35.7948 48.8084 34.7525 57.8938 33.71 66.9835L33.541 66.9922Z" fill="#FDA631"/>
      </svg>
      <ButtonsBar at="bottom">
        <Button class={styles.menuBtn} onClick={userStore.onboardingNext}>
          ОГО!
        </Button>
      </ButtonsBar>
    </>
  );
};

const OnboardStage2 = () => {
  return (
    <div flex column gap="10">
      <h1>Как это работает?</h1>
      <div>
        <h2 class={styles.menuText}>
          локально на поле
        </h2>
        <div class="text">
          Insight работает с помощью внутренней сети «Insomnia-WIFI», которая
          доступна только на территории фестиваля
        </div>
      </div>
      <div>
        <h2 class={styles.menuText}>не-интернет</h2>
        <div class="text">
          Заходить на другие сайты нельзя, но можно наслаждаться порталом, даже
          если нет подключения к сети
        </div>
      </div>
      <div class="sh1 colorDisco">
        Точки сети находятся у Инфоцентра и основных экранов
      </div>
      <ButtonsBar at="bottom">
        <Button class={styles.menuBtn} onClick={userStore.onboardingNext}>
          интересно
        </Button>
      </ButtonsBar>
    </div>
  );
};

const OnboardStage3 = () => {
  return (
    <div flex column gap="10">
      <h1>insight это </h1>
      <div flex column gap="8">
        <h2 class={styles.menuText}>Карта фестиваля</h2>
        <h2 class={styles.menuText}>Расписание ночных показов</h2>
        <h2 class={styles.menuText}>расписание дневных мероприятий</h2>
        <h2 class={styles.menuText}>онлайн доска объявлений</h2>
      </div>
      <ButtonsBar at="bottom">
        <Button class={styles.menuBtn} onClick={userStore.onboardingNext}>
          круто!
        </Button>
      </ButtonsBar>
    </div>
  );
};
const OnboardStage4 = () => {
  return (
    <div flex column gap="8">
      <h1>а ещё тут можно</h1>
      <div>
        <h2 class={styles.menuText}>сохранять</h2>
        <div class="text">
          мультфильмы, мероприятия и места в избранное, чтобы ничего
          не пропустить!
        </div>
      </div>
      <div>
        <h2 class={styles.menuText}>проголосовать</h2>
        <div class="text">
          за лучший мультфильм в номинации «Приз зрительских симпатий»
        </div>
      </div>
      <ButtonsBar at="bottom">
        <Button class={styles.menuBtn} onClick={userStore.onboardingNext}>
          Начать
        </Button>
      </ButtonsBar>
    </div>
  );
};

const Stages = [OnboardStage1, OnboardStage2, OnboardStage3, OnboardStage4];
