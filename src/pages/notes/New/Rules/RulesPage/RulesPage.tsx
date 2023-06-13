import { PageSection } from "@components/Layout/PageSection/PageSection";
import { FunctionalComponent } from "preact";
import newStyles from "../../new.module.css";
import classNames from "classnames";
import { NextButton } from "../../NextButton/NextButton";
import { useNotesRouter } from "../../../hooks/useNotesRouter";

// TODO: не хватает шрифта SF Pro
export const RulesPage: FunctionalComponent = () => {
  const { goToNew } = useNotesRouter();
  const onNextClick = () => {
    goToNew("editor");
  };

  return (
    <PageSection className={classNames(newStyles.rulesPage)}>
      <div className={classNames(newStyles.rulesSecion)}>
        <h2 className={classNames("sh1", newStyles.rulesSectionTitle)}>
          Объявления можно отправить только онлайн
        </h2>
        <p className={"text colorMediumBlue"}>
          Точки доступа: Инфоцентр, Полевой экран, Речной экран
        </p>
      </div>

      <div className={classNames(newStyles.rulesSecion)}>
        <h2 className={classNames("sh1", newStyles.rulesSectionTitle)}>
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

      <div className={classNames(newStyles.rulesSecion)}>
        <h2 className={classNames("sh1", newStyles.rulesSectionTitle)}>
          Такое не&nbsp;опубликуем:
        </h2>
        {/* TODO: стилизовать по фигме */}
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

      <NextButton onClick={onNextClick} className={newStyles.rulesNextBtn}>
        Написать объявление
      </NextButton>
    </PageSection>
  );
};
