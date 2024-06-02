import styles from "./onboard.module.css";
import { Button, ButtonsBar, CloseButton } from "@components";
import { useEffect } from "preact/hooks";
import { useRouter } from "../routing";
import { useCell } from "@helpers/cell-state";
import { userStore } from "@stores/user.store";

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
      <img className={styles.img1} src="/public/images/rabbit.webp"/>
      <div>
        <h1>
          Привет!
          <br />
          Это insight
        </h1>
        <div class="text">— локальный портал «Бессонницы»</div>
      </div>
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
        <h2 class={styles.menuText}>Почти интернет</h2>
        <div class="text">
          Заходить на другие сайты нельзя, но можно наслаждаться порталом, даже
          если нет подключения к сети
        </div>
      </div>
      <div class="sh1 colorWhite">
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
      <h2>
        <ul class="styledList" flex column gap="8">
          <li>Карта фестиваля</li>
          <li>Расписание ночных показов</li>
          <li>расписание дневных мероприятий</li>
          <li>онлайн доска объявлений</li>
        </ul>
      </h2>
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
    <>
      <h1>а ещё тут можно</h1>
      <div flex column gap={8}>
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
      </div>
      <div class="fix-flex-aroung"></div>
      <ButtonsBar at="bottom">
        <Button class={styles.menuBtn} onClick={userStore.onboardingNext}>
          Начать
        </Button>
      </ButtonsBar>
    </>
  );
};

const Stages = [OnboardStage1, OnboardStage2, OnboardStage3, OnboardStage4];
