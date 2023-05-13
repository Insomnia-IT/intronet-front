import styles from "./onboard.style.css";
import { Button, ButtonsBar, CloseButton } from "@components";
import { useEffect } from "preact/hooks";
import { useRouter } from "../routing";
import { useCell } from "@helpers/cell-state";
import { userStore } from "@stores/user.store";

export const OnboardPage = () => {
  const stage = useCell(() => userStore.OnboardingPhase);
  const router = useRouter();
  useEffect(() => {
    console.log(stage);
    if (Number.isNaN(stage)) userStore.OnboardingPhase = 0;
    if (stage >= Stages.length) router.goTo(["main"], {}, true);
  }, [stage]);
  const Page = Stages[+stage] ?? (() => <></>);
  return (
    <div class={styles.page}>
      <Page />
      <CloseButton white onClick={userStore.onboardingFinish} />
    </div>
  );
};

const OnboardStage1 = () => {
  return (
    <>
      <h1>
        Привет!
        <br />
        Это insight
      </h1>
      <div class="text">— локальный портал Бессонницы</div>
      <img class={styles.fireboy} src="/public/images/fire_boy.webp" />
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
        <h2 class={styles.menuText} style={{ marginTop: 40 }}>
          локально на поле
        </h2>
        <div class="text">
          Insight работает с помощью внутренней сети «Insomnia-WIFI», которая
          доступна только на территории фестиваля
        </div>
      </div>
      <div>
        <h2 class={styles.menuText}>почти интернет</h2>
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
      <div class={styles.menuText} flex column gap="8">
        <h2>Карта фестиваля</h2>
        <h2>Расписание ночных показов</h2>
        <h2>расписание дневных мероприятий</h2>
        <h2>онлайн доска объявлений</h2>
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
