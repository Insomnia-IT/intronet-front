import { CloseButton, Sheet } from "../../components";
import { useCell } from "../../helpers/cell-state";
import { Logo } from "../../icons";
import { mainPageStore } from "../../stores/main-page.store";
import { useMemo, useState } from "preact/hooks";
import { RoutePath, useRouter } from "../routing";
import { MainCard } from "./card/main-card";
import { AddNews } from "./news/add-news";
import { AllNews } from "./news/all-news";
import { EditNews } from "./news/edit-news";
import { News } from "./news/news";
import { SearchInput } from "@components/input/search-input";
import { AllSearchPage } from "../search/all-search-page";
import { PageLayout } from "@components/PageLayout";
import styles from "./main-page.module.css";
import { BookmarkIcon } from "@components/BookmarkGesture/bookmark-icon";

export const MainPage = () => {
  const state = useCell(mainPageStore.State);
  const router = useRouter();
  const sheetItems = useMemo(() => getSheetItems(router.route), [router.route]);
  const [searchSheetOpen, setSearchSheetOpen] = useState(false);
  return (
    <PageLayout design="dark" withTapBar className={styles.mainPage}>
      <Logo />
      <BookmarkIcon
        onClick={() => router.goTo(["bookmarks"])}
        style={{ color: "var(--white)", position: "absolute", right: "2em" }}
      />
      <SearchInput
        placeholder="Поиск всего-всего"
        onFocus={() => {
          console.log("focus");
          setSearchSheetOpen(true);
        }}
      />
      <News />
      {state.sections.map((x) => (
        <div key={x.section} flex column gap="2">
          <h2 class="colorWhite">{x.title}</h2>
          <div flex column gap="1">
            {x.rows.map(({ row, cards }) => (
              <div gap="1" flex>
                {cards.map((c) => (
                  <MainCard info={c} key={c} />
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
