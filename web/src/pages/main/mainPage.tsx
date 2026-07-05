import { CloseButton, Sheet } from "../../components";
import { Logo } from "../../icons";
import { useMemo, useState } from "preact/hooks";
import { RoutePath, useRouter } from "../routing";
import { MainCard } from "./card/main-card";
import { AddNews } from "./news/add-news";
import { AllNews } from "./news/all-news";
import { EditNews } from "./news/edit-news";
import { News } from "./news/news";
import { AllSearchPage } from "../search/all-search-page";
import { PageLayout } from "@components/PageLayout";
import styles from "./main-page.module.css";
import { mainPageData } from "./data";
import { useCell } from "@helpers/cell-state";
import { getWeatherCategoryByCondition, weatherStore } from "@stores/weather.store";
import { getCurrentDay, getDayText } from "@helpers/getDayText";
import { SearchButton } from "@components/buttons/search-button";

export const MainPage = () => {
  const router = useRouter();
  const sheetItems = useMemo(() => getSheetItems(router.route), [router.route]);
  const [searchSheetOpen, setSearchSheetOpen] = useState(false);
  const weather = useCell(() => weatherStore.weather);

  return (
    <PageLayout design="dark" withTapBar
                title={<Logo />}
                className={styles.mainPage}
                headerStyle={styles.header}>
      <SearchButton onClick={() => setSearchSheetOpen(true)}/>
      <News />
      <div flex column>
        <div flex column gap={1}>
          <div flex gap={1}>
            <MainCard id="weather" link="/weather" title={getWeatherCategoryByCondition(weather?.days[0].condition ?? 0)} descr={`Сегодня, ${getDayText(getCurrentDay(), 'full')}`} size="large"/>
            <MainCard id="notes" link="/notes" title="Объявления" descr="Записочки, как на инфоцентре!" color size="large"/>
          </div>
        </div>
      </div>
      {mainPageData.map((section) => (
        <div key={section.id} flex column>
          {section.title && <h2 class="colorWhite">{section.title}</h2>}
          <div flex column gap={1}>
            {section.rows.map((row, index) => (
              <div flex gap={1} key={index}>
                {row.map((card) => (
                  <MainCard {...card} key={card.id} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
      <Sheet
        children={sheetItems}
        height={router.route[2] === undefined ? "auto" : "100%"}
        onClose={() => router.goTo(["main"])}
      />
      {searchSheetOpen && (
        <Sheet
          children={
            <>
              <AllSearchPage />
              <CloseButton onClick={() => setSearchSheetOpen(false)} />
            </>
          }
          noShadow={true}
          height="100%"
          onClose={() => router.goTo(["main"])}
        />
      )}
    </PageLayout>
  );
};

function getSheetItems(route: RoutePath) {
  switch (route[1]) {
    case "news":
      switch (route[2]) {
        case "add":
          return <AddNews />;
        case undefined:
          return <AllNews />;
        default:
          return <EditNews />;
      }
  }
  return null;
}
