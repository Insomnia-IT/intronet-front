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
      <img className={styles.img1} src="/public/images/onboarding.webp" />
      <div>
        <h1>
          привет!
          это инсайт!
        </h1>
        <div class="text">— локальный портал «Бессонницы»</div>
      </div>
      <Button class={styles.menuBtn} type="vivid" onClick={userStore.onboardingNext}>
        ого!
      </Button>
    </>
  );
};

const OnboardStage2 = () => {
  return (
    <>
      <div flex column>
        <h1>как это работает?</h1>
        <div>
          <h2 class={styles.menuText}>Локально на поле</h2>
          <div class="text colorLightSecondary">
            Добавь приложение на главный экран телефона и пользуйся им всё время на поле!
          </div>
        </div>
        <div>
          <h2 class={styles.menuText}>Почти интернет</h2>
          <div class="text colorLightSecondary">
            Подключись к внутренней сети «Insomnia-WIFI». Заходить на другие сайты нельзя, но зато
            в Insight получится видеть изменения, новости и писать объявления.
          </div>
        </div>
        <div class={styles.menuText}>
          Точки сети находятся у Инфоцентра, Фудкорта и основных экранов
        </div>
      </div>
      <Button class={styles.menuBtn}
       type="vivid"
       onClick={userStore.onboardingNext}>
        интересно
      </Button>
    </>
  );
};

const OnboardStage3 = () => {
  return (
    <>
      <div flex column gap="10">
        <h1>инсайт это </h1>
        <ul class="styledList" flex column gap="2">
          <li>Карта фестиваля</li>
          <li>Расписание ночных показов</li>
          <li>Расписание дневных мероприятий</li>
          <li>Онлайн доска объявлений</li>
        </ul>
      </div>
      <Button class={styles.menuBtn}
        type="vivid"
        onClick={userStore.onboardingNext}>
        круто!
      </Button>
    </>
  );
};
const OnboardStage4 = () => {
  return (
    <>
      <div flex column>
        <h1>а ещё тут можно</h1>
        <div>
          <h2 class={styles.menuText}>Сохранять</h2>
          <div class="text colorLightSecondary">
            Мультфильмы, мероприятия и места в избранное, чтобы ничего не
            пропустить!
          </div>
        </div>
        <div>
          <h2 class={styles.menuText}>Проголосовать</h2>
          <div class="text colorLightSecondary">
            За лучший мультфильм в номинации «Приз зрительских симпатий»
          </div>
        </div>
        <div class={styles.menuText}>
          Все вопросы - в Кибер-инфо (локация Инфоцентра)
        </div>
      </div>
      <Button class={styles.menuBtn}
        type="vivid"
        onClick={userStore.onboardingNext}>
        начать
      </Button>
    </>
  );
};

const Stages = [OnboardStage1, OnboardStage2, OnboardStage3, OnboardStage4];
