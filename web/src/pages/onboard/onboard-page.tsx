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
        <img className={styles.img1} src="/public/images/onboarding.webp" />
        <h1>
          Привет!
          <br />
          Это insight
        </h1>
        <div class="text">— локальный портал «Бессонницы»</div>
      </div>
      <Button class={styles.menuBtn} type="vivid" onClick={userStore.onboardingNext}>
        ОГО!
      </Button>
    </>
  );
};

const OnboardStage2 = () => {
  return (
    <>
      <div flex column>
        <h1>Как это работает?</h1>
        <div>
          <h2 class={styles.menuText}>локально на поле</h2>
          <div class="text colorGrey2">
            Добавь приложение на главный экран телефона и пользуйся им всё время на поле!
          </div>
        </div>
        <div>
          <h2 class={styles.menuText}>Почти интернет</h2>
          <div class="text colorGrey2">
            Подключись к внутренней сети «Insomnia-WIFI». Заходить на другие сайты нельзя, но зато
            в Insight получится видеть изменения, новости и писать объявления.
          </div>
        </div>
        <div class="text colorGrey2">
          Точки сети находятся у Инфоцентра, Фудкрота и основных экранов
        </div>
      </div>
      <Button class={styles.menuBtn} type="vivid" onClick={userStore.onboardingNext}>
        интересно
      </Button>
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
      <Button class={styles.menuBtn} type="vivid" onClick={userStore.onboardingNext}>
        круто!
      </Button>
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
          <div class="text colorGrey2">
            Мультфильмы, мероприятия и места в избранное, чтобы ничего не
            пропустить!
          </div>
        </div>
        <div>
          <h2 class={styles.menuText}>проголосовать</h2>
          <div class="text colorGrey2">
            За лучший мультфильм в номинации «Приз зрительских симпатий»
          </div>
        </div>
        <div class="text colorGrey2">
          Все вопросы - в Кибер-инфо (локация Инфоцентра)
        </div>
      </div>
      <Button class={styles.menuBtn} type="vivid" onClick={userStore.onboardingNext}>
        Начать
      </Button>
    </>
  );
};

const Stages = [OnboardStage1, OnboardStage2, OnboardStage3, OnboardStage4];
