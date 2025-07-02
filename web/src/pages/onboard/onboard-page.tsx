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
      <CloseButton
        white
        onClick={userStore.onboardingFinish}
        className={styles.close}
      />
    </div>
  );
};

const OnboardStage1 = () => {
  return (
    <>
      <div>
        <img className={styles.img1} src="/public/images/rabbit.webp" />
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
    <>
      <div flex column gap="10">
        <h1>Как это работает?</h1>
        <div>
          <h2 class={styles.menuText}>локально на поле</h2>
          <div class="text">
            Добавь приложение на главный экран телефона и пользуйся им всё время на поле!
          </div>
        </div>
        <div>
          <h2 class={styles.menuText}>Почти интернет</h2>
          <div class="text">
            Подключись к внутренней сети «Insomnia-WIFI». Заходить на другие сайты нельзя, но зато 
            в Insight получится видеть изменения, новости и писать объявления.
          </div>
        </div>
        <div class="sh1 colorWhite">
          Точки сети находятся у Инфоцентра, Фудкрота и основных экранов
        </div>
      </div>
      <ButtonsBar at="bottom">
        <Button class={styles.menuBtn} onClick={userStore.onboardingNext}>
          интересно
        </Button>
      </ButtonsBar>
    </>
  );
};

const OnboardStage3 = () => {
  return (
    <>
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
      </div>
      <ButtonsBar at="bottom">
        <Button class={styles.menuBtn} onClick={userStore.onboardingNext}>
          круто!
        </Button>
      </ButtonsBar>
    </>
  );
};
const OnboardStage4 = () => {
  return (
    <>
      <div flex column gap={8}>
        <h1>а ещё тут можно</h1>
        <div>
          <h2 class={styles.menuText}>сохранять</h2>
          <div class="text">
            мультфильмы, мероприятия и места в избранное, чтобы ничего не
            пропустить!
          </div>
        </div>
        <div>
          <h2 class={styles.menuText}>проголосовать</h2>
          <div class="text">
            за лучший мультфильм в номинации «Приз зрительских симпатий»
          </div>
        </div>
        <div class="sh1 colorWhite">
          Все вопросы - в Кибер-инфо (локация Инфоцентра)
        </div>
      </div>
      <ButtonsBar at="bottom">
        <Button class={styles.menuBtn} onClick={userStore.onboardingNext}>
          Начать
        </Button>
      </ButtonsBar>
    </>
  );
};

const Stages = [OnboardStage1, OnboardStage2, OnboardStage3, OnboardStage4];
