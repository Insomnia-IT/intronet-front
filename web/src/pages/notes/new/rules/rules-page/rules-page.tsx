import classNames from "classnames";
import { useNotesRouter } from "../../../hooks/useNotesRouter";
import { ButtonsBar } from "@components";
import { OnlineButton } from '@components/buttons/online-button'
import styles from "./rules.module.css";

export const RulesPage = () => {
  const { goToNew } = useNotesRouter();
  const onNextClick = () => {
    goToNew("editor");
  };

  return (
    <>
      <div className={classNames(styles.rulesSecion)}>
        <h2 className={classNames("sh1", styles.rulesSectionTitle)}>
          Объявления можно отправить только онлайн
        </h2>
        <p className={"text colorMediumBlue"}>
          Точки доступа: Инфоцентр, Фудкорт, Полевой экран, Речной экран
        </p>
      </div>

      <div className={classNames(styles.rulesSecion)}>
        <h2 className={classNames("sh1", styles.rulesSectionTitle)}>
          Модерация
        </h2>
        <p className={"text colorMediumBlue"}>
          Мы&nbsp;проверяем все тексты, так что после отправки пройдёт некоторое
          время, прежде чем объявление будет опубликовано. Примерно
          30&nbsp;минут днём.
          <br />
          <br />
          Ночью модераторы могут отдыхать и&nbsp;опубликуют ваше объявление
          утром.
        </p>
      </div>

      <div className={classNames(styles.rulesSecion)}>
        <h2 className={classNames("sh1", styles.rulesSectionTitle)}>
          Такое не&nbsp;опубликуем:
        </h2>
        <ul className={"text colorMediumBlue styledList "}>
          {[
            "Оскорбления",
            "Спам и реклама",
            "Политические дискуссии",
            "Всё, что запрещено законом РФ",
          ].map((rule) => {
            return <li>{rule}</li>;
          })}
        </ul>
      </div>

      <ButtonsBar fill>
        <OnlineButton onClick={onNextClick} className={styles.rulesNextBtn} type={"blue"}>
          Написать объявление
        </OnlineButton>
      </ButtonsBar>
    </>
  );
};
